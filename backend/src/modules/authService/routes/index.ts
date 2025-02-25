import express from 'express';
const router = express.Router();

// Import routes
import otpRoute from './otp.route';
import tokenRoute from './token.route';
import registerRoute from './register.route';
import loginRoute from './login.route';

// Connect routes
otpRoute(router);
tokenRoute(router);
registerRoute(router);
loginRoute(router);

// Export router
export default router;