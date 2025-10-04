import { Router } from 'express';
import { requestOtp, verifyOtp, resendOtp, requestPasswordReset, verifyPasswordResetOtp, resetPassword, login } from '../controllers/authController.js';
import { otpRequestLimiter } from '../middleware/rateLimiter.js';

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

export default router;


