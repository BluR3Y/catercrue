import { Router } from "express";
import * as authController from '../controllers/auth.controller';
import { authenticate } from "../middlewares/auth";
import otpMiddleware from "../middlewares/otp.middleware";

export default function(router: Router) {
    // Login Handlers
    router.post('/auth/login/local', authenticate.localLogin, authController.login);
    router.get('/auth/login/google', authenticate.google);
    router.get('/auth/google/callback', authenticate.google, authController.login);

    // Token Handlers
    router.post('/auth/refresh', authenticate.jwt([]), authController.refreshToken);

    // OTP handlers
    router.post('/auth/otp/request', authController.requestOTP);
    router.post('/auth/otp/verify', authController.verifyOTP);

    // Register handlers
    router.post('/auth/register/user', otpMiddleware, authController.registerUser);
    router.post('/auth/register/caterer', otpMiddleware, authController.registerCaterer);
    router.post('/auth/register/worker', otpMiddleware, authController.registerWorker);

    // Logout
    router.post('/auth/logout', authenticate.jwt(), authController.logout);

    router.get('/auth/register/:identifierType(phone|email)/:identifierValue', authController.identifierAvailability);
}