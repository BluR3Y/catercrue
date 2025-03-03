import { Request, Response, NextFunction, RequestHandler } from "express";
import orm from "../../../models";
import StaffRole from "../../../models/staffRole.model";

export const getEventTypes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const eventTypes = await orm.EventType.findAll();
        res.json(eventTypes);
    } catch (err) {
        next(err);
    }
}

export const postEvent: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.user as any;
        const {
            eventTypeId,
            location,
            scheduledDate,
            duration
        } = req.body;

        const createdEvent = await orm.Event.create({
            coordinatorId: id,
            eventTypeId,
            location,
            scheduledDate,
            duration
        });

        res.status(201).json(createdEvent);
    } catch (err) {
        next(err);
    }
}

export const getEvent: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as any;
        const { eventId } = req.params;
        const event = await orm.Event.findByPk(eventId, {
            attributes: ['id', 'coordinatorId']
        });

        if (!event) {
            res.status(404).json({ message: "Event not found" });
            return;
        }

        if (event.coordinatorId === user.id) {
            res.json(event);
            return;
        }

        const staffData = await orm.EventStaff.findOne({
            where: { userId: user.id, eventId },
            include: [{ model: StaffRole, as: 'role' }]
        });
        
        if (!staffData) {
            res.status(403).json({ message: "Unauthorized access" });
            return;
        }

        res.json({
            id: event.id,
            location: event.location,
            scheduledDate: event.scheduledDate,
            duration: event.duration
        });
    } catch (err) {
        next(err);
    }
}


