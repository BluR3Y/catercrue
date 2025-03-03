import { Router } from "express";
import * as eventController from '../controllers/event.controller';
import { authenticate } from "../middlewares/auth";

export default function(router: Router) {
    router.get('/event/types', eventController.getEventTypes);
}