import { Router } from 'express';
import { requestOtp, verifyOtp, resendOtp } from '../controllers/authController.js';
import bcrypt from 'bcrypt';
import pool from '../config/db.js';
import { otpRequestLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/request-otp', otpRequestLimiter, requestOtp);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', otpRequestLimiter, resendOtp);

export default router;

// Login route with role check
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body || {};
    if (!email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Missing credentials' });
    }
    const roleLower = String(role).toLowerCase();
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ? AND role = ?', [email, roleLower]);
    const user = rows[0];
    if (!user) {
      console.log(`Login failed: no match found for role ${roleLower} ${email}`);
      return res.status(404).json({ success: false, message: 'User not found for this role' });
    }
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      console.log(`Login failed: wrong password for role ${roleLower} ${email}`);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    console.log(`Login successful: ${roleLower} ${email}`);
    return res.status(200).json({ success: true, message: 'Login successful' });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});


