import { Router } from "express";
import * as authController from '../controllers/auth.controller';

export default function(router: Router) {
    router.post('/auth/login/local', authController.localLogin);
    router.post('/auth/login/google', (req, res, next) => {});
    router.post('/auth/refresh', authController.refreshToken);
    router.post('/auth/otp/request', authController.requestOTP);
    router.post('/auth/otp/verify', authController.verifyOTP);
}