import { Router } from "express";
import * as eventController from '../controllers/event.controller';
import { rbac } from "@/auth";

export default function(router: Router) {
    router.get('/event/types', eventController.getEventTypes);
    router.post('/events', rbac(['coordinator']), eventController.createEvent);
}