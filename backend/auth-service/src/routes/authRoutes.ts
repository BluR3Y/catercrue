import { Router } from "express";
import * as accountController from "../controllers/accountController"
import { authenticateToken } from "../utils/auth";

export default function(router: Router) {
    router.post('/accounts/login', accountController.login);
    router.post('/accounts/refresh-token', authenticateToken, accountController.refreshToken);
    router.delete('/accounts/logout', authenticateToken, accountController.logout);
}