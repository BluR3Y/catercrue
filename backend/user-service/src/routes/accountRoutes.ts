import { Router } from "express";
import * as accountController from "../controllers/accountController"

export default function(router: Router) {
    router.get('/accounts/register', accountController.register);
    router.post('/accounts/login', accountController.login);
}