import { Router } from "express";
import * as registerController from "../controllers/register.controller";
import { otpAuthMiddleware } from "../middlewares/otp.middleware";

export default function(router: Router) {
    router.post('/register', otpAuthMiddleware, registerController.register);

    router.get('/register/:identifierType(phone|email)/:identifierValue', registerController.identifierAvailability);
}