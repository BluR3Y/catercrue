import { RequestHandler } from "express";
import { orm } from "@/models";
import type { Coordinator } from "@/models/sequelize/vendorModels/coordinator.model";

export const getEventTypes: RequestHandler = async (req, res, next) => {
    try {
        const eventTypes = await orm.EventType.findAll();
        res.json(eventTypes);
    } catch (err) {
        next(err);
    }
}

export const createEvent: RequestHandler = async (req, res, next) => {
    try {
        const { roleData, body } = req;
        if (!roleData) {
            throw new Error("Failed to authenticate user");
        }
        const { data } = roleData as { role: 'coordinator'; data: Coordinator };

        const {
            type_id,
            state,
            coordinates,
            start,
            end
        } = body;

        const eventData = await data.createEvent({
            type_id,
            state,
            location: { type: "Point", coordinates } as any,
            start: new Date(start),
            end: new Date(end)
        });

        res.status(201).json({
            message: "Event Successfully created",
            event: eventData.toJSON()
        });
    } catch (err) {
        next(err);
    }
}