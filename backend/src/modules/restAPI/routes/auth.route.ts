import { Router } from "express";
import * as authController from '../controllers/auth.controller';
import { authenticate } from "../middlewares/auth";
import otpMiddleware from "../middlewares/otp.middleware";

export default function(router: Router) {
    router.post('/auth/login/local/:role(coordinator|worker)', authenticate.localLogin, authController.login);
    router.post('/auth/login/google', (req, res, next) => {});
    router.post('/auth/register/:role(coordinator|worker)', authController.registerUser);
    router.post('/auth/refresh', authenticate.jwt, authController.refreshToken);
    router.post('/auth/otp/request', authController.requestOTP);
    router.post('/auth/otp/verify', authController.verifyOTP);

    router.get('/register/:identifierType(phone|email)/:identifierValue', authController.identifierAvailability);
}