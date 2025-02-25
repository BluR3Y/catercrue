import { Router } from "express";
import * as registerController from '../controllers/register.controller';
import { otpAuthMiddleware } from "../middlewares/otp.middleware";
// import { authenticateToken } from "../utils/auth";

export default function(router: Router): void {
    router.get('/register/:phoneNumber', registerController.getPhoneAvailability);
    router.post('/register/main', otpAuthMiddleware, registerController.postMainRegister);
}