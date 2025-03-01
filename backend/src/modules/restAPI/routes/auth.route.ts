import { Router } from "express";
import * as authController from '../controllers/auth.controller';
import { authenticate } from "../middlewares/auth";

export default function(router: Router) {
    router.post('/auth/login/local/:identifierType(phone|email)', authController.localLogin);
    router.post('/auth/login/google', (req, res, next) => {});
    router.post('/auth/refresh', authController.refreshToken);
    router.post('/auth/otp/request', authController.requestOTP);
    router.post('/auth/otp/verify', authController.verifyOTP);

    router.get('/auth/tester', authenticate.jwt, (req, res, next) => {
        res.json({message: req.user})
    })
}