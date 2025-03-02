import { Router } from "express";
import * as authController from '../controllers/auth.controller';
import { authenticate } from "../middlewares/auth";
import { UAParser } from "ua-parser-js";

export default function(router: Router) {
    router.post('/auth/login/local/:identifierType(phone|email)', authenticate.localLogin, authController.login);
    router.post('/auth/login/google', (req, res, next) => {});
    router.post('/auth/refresh', authenticate.jwt, authController.refreshToken);
    router.post('/auth/otp/request', authController.requestOTP);
    router.post('/auth/otp/verify', authController.verifyOTP);

    router.get('/auth/tester', (req, res, next) => {
        //console.log(req.useragent)  // use
        //console.log(UAParser(req.useragent?.source)); // use
        console.log(req.clientIp)
        // console.log(UAParser(req.headers['user-agent']))
        res.json({message: req.user})
    })
}