import { Router } from "express";
import * as authController from '../controllers/auth.controller';
import { authenticate, rbac } from "@/auth";
import otpMiddleware from "../middlewares/otp.middleware";

export default function(router: Router) {
    // Login Handlers
    router.post('/auth/login/local', authenticate.local, authController.login);
    router.get('/auth/login/google', authenticate.google);
    router.get('/auth/google/callback', authenticate.google, authController.login);

    // Token Handlers
    router.post('/auth/refresh', rbac([]), authController.refreshToken);

    // OTP handlers
    router.post('/auth/otp/request', authController.requestOTP);
    router.post('/auth/otp/verify', authController.verifyOTP);

    // Register handlers
    router.post('/auth/register/user', otpMiddleware, authController.registerUser);
    router.post('/auth/register/caterer', otpMiddleware, authController.registerCaterer);
    router.post('/auth/register/worker', otpMiddleware, authController.registerWorker);

    // Logout
    router.post('/auth/logout', rbac([]), authController.logout);

    router.get('/auth/register/:identifierType(phone|email)/:identifierValue', authController.identifierAvailability);
}