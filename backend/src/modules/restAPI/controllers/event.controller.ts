import { Request, Response, NextFunction } from "express";
import orm from "../../../models/sequelize";
import StaffRole from "../../../models/sequelize/staffRole.model";
import odm from "../../../models/mongoose";

export const getEventTypes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const eventTypes = await orm.EventType.findAll();
        res.json(eventTypes);
    } catch (err) {
        next(err);
    }
}

export const postEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.user!;
        const {
            eventTypeId,
            location,
            status,
            scheduledStart,
            scheduledEnd
        } = req.body;
        
        const createdEvent = await odm.eventModel.create({
            coordinatorId: id,
            eventTypeId,
            location,
            scheduledStart,
            scheduledEnd
        });

        res.status(201).json(createdEvent);
    } catch (err) {
        next(err);
    }
}

export const getEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user! as any;
        const { eventId } = req.params;
        const event = await odm.eventModel.findById(eventId);

        if (!event) {
            res.status(404).json({ message: "Event not found" });
            return;
        }

        if (event.coordinatorId !== user.id) {
            res.status(403).json({ message: "Unauthorized access" });
        }
        res.json(event);
    } catch (err) {
        next(err);
    }
}

export const getShift = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user!;
        const { shiftId } = req.body;

        const shift = await odm.shiftModel.findById(shiftId);
        if (!shift) {
            res.status(404).json({ message: "Shift not found" });
            return;
        }

        // const workerData = await shift.populate('workerId') as any;
        // if (workerData.userId !== user.id) {
        //     res.status(401).json({ message: "Unauthorized request" });
        //     return
        // }
        if (shift.workerId !== )

        res.json(shift);
    } catch (err) {
        next(err);
    }
}