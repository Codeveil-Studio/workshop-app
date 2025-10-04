import { Router } from 'express';
import { requestOtp, verifyOtp, resendOtp, requestPasswordReset, verifyPasswordResetOtp, resetPassword, login } from '../controllers/authController.js';
import { otpRequestLimiter } from '../middleware/rateLimiter.js';
import pool from '../config/db.js';

const router = Router();

// Signup OTP routes
router.post('/request-otp', otpRequestLimiter, requestOtp);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', otpRequestLimiter, resendOtp);

// Password reset routes
router.post('/request-password-reset', otpRequestLimiter, requestPasswordReset);
router.post('/verify-password-reset-otp', verifyPasswordResetOtp);
router.post('/reset-password', resetPassword);

// Login route
router.post('/login', login);

// Get users by role route (active users only)
router.get('/users/:role', async (req, res) => {
  try {
    const { role } = req.params;
    const validRoles = ['contractor', 'technician', 'supplier', 'consultant', 'admin'];
    
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role specified' });
    }

    const [users] = await pool.execute(
      'SELECT id, name, email, role, is_active, isBan, created_at FROM users WHERE role = ? AND is_active = TRUE AND (isBan IS NULL OR isBan = 0) ORDER BY created_at DESC',
      [role]
    );

    res.json({ users });
  } catch (error) {
    console.error('Error fetching users by role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get banned users by role route
router.get('/users/:role/banned', async (req, res) => {
  try {
    const { role } = req.params;
    const validRoles = ['contractor', 'technician', 'supplier', 'consultant', 'admin'];
    
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role specified' });
    }

    const [bannedUsers] = await pool.execute(
      'SELECT id, name, email, role, is_active, isBan, created_at FROM users WHERE role = ? AND isBan = 1 ORDER BY created_at DESC',
      [role]
    );

    res.json({ users: bannedUsers });
  } catch (error) {
    console.error('Error fetching banned users by role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Ban user route
router.put('/users/:id/ban', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.execute(
      'UPDATE users SET isBan = 1 WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User banned successfully' });
  } catch (error) {
    console.error('Error banning user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Unban user route
router.put('/users/:id/unban', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.execute(
      'UPDATE users SET isBan = 0 WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User unbanned successfully' });
  } catch (error) {
    console.error('Error unbanning user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user details by email route
router.get('/user/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    const [rows] = await pool.execute(
      'SELECT id, name, email, role, is_active, isBan, created_at FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = rows[0];
    res.json({ 
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.is_active,
        isBanned: user.isBan,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


