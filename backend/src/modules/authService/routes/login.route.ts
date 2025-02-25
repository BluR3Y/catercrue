import { Router } from "express";
import * as loginController from "../controllers/login.controller";

export default function(router: Router) {
    router.post('/login/local', loginController.localLogin);
}