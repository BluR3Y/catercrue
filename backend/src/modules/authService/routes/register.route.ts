import { Router } from "express";
import * as registerController from '../controllers/register.controller';
// import { authenticateToken } from "../utils/auth";

// export const connectRoutes = (router: Router) => {
//     router.get('/tester', (req: any, res: any, next: any) => { res.status(200).send('Hello') });
//     router.post('/register_step_one', registerController.firstStep);
// }

export default function(router: Router): void {
    router.get('/tester', (req: any, res: any, next: any) => { res.status(200).send('Hello') });
    router.post('/register_step_one', registerController.firstStep);
}