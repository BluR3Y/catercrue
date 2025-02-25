import { Router } from "express";
import * as tokenController from "../controllers/token.controller";
import authenticateToken from "../middlewares/token.middleware";

export default function(router: Router) {
    router.post('/refresh-token', authenticateToken, tokenController.postRefreshToken);
}