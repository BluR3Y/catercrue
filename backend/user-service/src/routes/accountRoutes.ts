import { Router } from "express";
import * as accountController from "../controllers/accountController"
// import { authenticateToken } from "../utils/auth";

export default function(router: Router) {
    router.post('/accounts/register', accountController.register);
}