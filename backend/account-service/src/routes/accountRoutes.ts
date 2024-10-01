import { Router } from "express";
import * as accountController from "../controllers/accountController"
import { authenticateToken } from "../auth";

export default function(router: Router) {
    router.post('/accounts/login', authController.login);
    router.post('/accounts/refresh-token', authenticateToken, authController.refreshToken);
    router.delete('/accounts/logout', authenticateToken, authController.logout);

    router.post('/accounts/register', registerController.registrationIdentifier);
}