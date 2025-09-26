import pool from '../config/db.js';
import transporter from '../config/mail.js';
import { generateOtp, hashOtp, compareOtp, invalidateOtpsForEmail, createOtpRecord, getLatestActiveOtp, incrementOtpAttempts, markOtpUsed } from '../services/otpService.js';
import { findUserByEmail, upsertPendingSignup, getPendingSignupByEmail, deletePendingSignupByEmail, createUserFromPending } from '../services/userService.js';

function isValidEmail(email) {
  return /.+@.+\..+/.test(email);
}

function isStrongPassword(pw) {
  return typeof pw === 'string' && pw.length >= 8;
}

export async function requestOtp(req, res) {
  try {
    const { name, email, password, role } = req.body || {};
    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const validRoles = ['contractor','technician','supplier','consultant'];
    if (!validRoles.includes(String(role).toLowerCase())) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email' });
    }
    if (!isStrongPassword(password)) {
      return res.status(400).json({ success: false, message: 'Password too weak (min 8 chars)' });
    }

    // Check existing user
    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    // Database: pending signup + OTP insert
    let expiresAt;
    try {
      await upsertPendingSignup(email, name, password, String(role).toLowerCase());

      const otp = generateOtp();
      const otpHash = await hashOtp(otp);
      const expiryMinutes = Number(process.env.OTP_EXPIRY_MINUTES || 5);

      await invalidateOtpsForEmail(email);
      const rec = await createOtpRecord(email, otpHash, expiryMinutes);
      expiresAt = rec.expiresAt;

      // Email send
      try {
        await transporter.sendMail({
          from: process.env.SMTP_EMAIL,
          to: email,
          subject: 'Your verification code',
          text: `Your OTP is ${otp}. It expires in ${expiryMinutes} minutes.`,
          html: `<p>Your OTP is <b>${otp}</b>. It expires in ${expiryMinutes} minutes.</p>`
        });
      } catch (mailErr) {
        console.error('requestOtp mail error', mailErr.message);
        return res.status(500).json({ success: false, message: 'Failed to send OTP (email)', errorCode: 'EMAIL_SEND_FAILED' });
      }
    } catch (dbErr) {
      console.error('requestOtp db error', dbErr.message);
      return res.status(500).json({ success: false, message: 'Failed to send OTP (database)', errorCode: 'DB_WRITE_FAILED' });
    }

    const resendCooldown = Number(process.env.OTP_RESEND_COOLDOWN_SECONDS || 60);
    return res.status(200).json({ success: true, message: 'OTP sent to your email', resendCooldownSeconds: resendCooldown, expiresAt });
  } catch (err) {
    console.error('requestOtp error', err.message);
    return res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
}

export async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body || {};
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Missing email or otp' });
    }

    const record = await getLatestActiveOtp(email);
    if (!record) {
      return res.status(400).json({ success: false, message: 'OTP expired or not found' });
    }
    const maxAttempts = Number(process.env.MAX_OTP_VERIFY_ATTEMPTS || 5);
    if (record.attempts >= maxAttempts || new Date(record.expires_at).getTime() < Date.now()) {
      await markOtpUsed(record.id);
      return res.status(400).json({ success: false, message: 'OTP expired or not found' });
    }

    const ok = await compareOtp(otp, record.otp_hash);
    if (!ok) {
      await incrementOtpAttempts(record.id);
      const remaining = Math.max(0, maxAttempts - (record.attempts + 1));
      if (remaining === 0) {
        await markOtpUsed(record.id);
        return res.status(429).json({ success: false, message: 'Too many attempts' });
      }
      return res.status(400).json({ success: false, message: 'Invalid OTP', remainingAttempts: remaining });
    }

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const pending = await getPendingSignupByEmail(email, conn);
      if (!pending) {
        await conn.rollback();
        await markOtpUsed(record.id);
        return res.status(400).json({ success: false, message: 'No pending signup found' });
      }

      const existing = await conn.execute('SELECT id FROM users WHERE email = ?', [email]);
      if (existing[0].length) {
        await conn.rollback();
        await markOtpUsed(record.id);
        return res.status(409).json({ success: false, message: 'Email already registered' });
      }

      await createUserFromPending(email, conn);
      await deletePendingSignupByEmail(email, conn);
      await markOtpUsed(record.id, conn);

      await conn.commit();
    } catch (txErr) {
      await pool.query('ROLLBACK');
      console.error('verifyOtp transaction error', txErr.message);
      return res.status(500).json({ success: false, message: 'Server error' });
    } finally {
      try { await pool.query('RELEASE'); } catch {}
    }

    return res.status(201).json({ success: true, message: 'Account created successfully', redirect: '/login' });
  } catch (err) {
    console.error('verifyOtp error', err.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

export async function resendOtp(req, res) {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ success: false, message: 'Email required' });

    const pending = await getPendingSignupByEmail(email);
    if (!pending) return res.status(400).json({ success: false, message: 'No pending signup found' });

    const resendCooldown = Number(process.env.OTP_RESEND_COOLDOWN_SECONDS || 60);
    const latest = await getLatestActiveOtp(email);
    if (latest) {
      const createdMs = new Date(latest.created_at).getTime();
      if (Date.now() - createdMs < resendCooldown * 1000) {
        return res.status(429).json({ success: false, message: 'Please wait before requesting another OTP' });
      }
    }

    await invalidateOtpsForEmail(email);
    const otp = generateOtp();
    const otpHash = await hashOtp(otp);
    const expiryMinutes = Number(process.env.OTP_EXPIRY_MINUTES || 5);
    await createOtpRecord(email, otpHash, expiryMinutes);

    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: 'Your new verification code',
      text: `Your OTP is ${otp}. It expires in ${expiryMinutes} minutes.`,
      html: `<p>Your OTP is <b>${otp}</b>. It expires in ${expiryMinutes} minutes.</p>`
    });

    return res.status(200).json({ success: true, message: 'OTP sent to your email', resendCooldownSeconds: resendCooldown });
  } catch (err) {
    console.error('resendOtp error', err.message);
    return res.status(500).json({ success: false, message: 'Failed to resend OTP' });
  }
}


