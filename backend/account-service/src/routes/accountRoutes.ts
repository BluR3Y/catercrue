import { Router } from "express";
import * as authController from "../controllers/authController";
import * as registerController from "../controllers/registerController";
import { authenticateToken } from "../utils/auth";

export default function(router: Router) {
    router.post('/accounts/login', authController.login);
    router.post('/accounts/refresh-token', authenticateToken, authController.refreshToken);
    router.delete('/accounts/logout', authenticateToken, authController.logout);

    router.post('/accounts/register', registerController.registrationIdentifier);
}