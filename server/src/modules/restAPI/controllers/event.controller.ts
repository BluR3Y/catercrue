import { RequestHandler } from "express";
import { odm, orm } from "@/models";

export const getEventTypes: RequestHandler = async (req, res, next) => {
    try {
        const eventTypes = await orm.EventType.findAll();
        res.json(eventTypes);
    } catch (err) {
        next(err);
    }
}

export const postEvent: RequestHandler = async (req, res, next) => {
    try {
        const roleData = req.roleData;
        if (!roleData) {
            res.status(401).json({ message: "Unauthorized request" });
            return;
        }

        const {
            eventType,
            status,
            location,
            scheduledStart,
            scheduledEnd
        } = req.body;

        const eventData = await odm.eventModel.create({
            eventType,
            status,
            location,
            scheduledStart,
            scheduledEnd
        });

        res.status(201).json({ message: "Event Successfully created" });
    } catch (err) {
        next(err);
    }
}

export const getEvent: RequestHandler = async (req, res, next) => {
    try {

    } catch (err) {
        next(err);
    }
}

export const updateEvent: RequestHandler = async (req, res, next) => {
    try {

    } catch (err) {
        next(err);
    }
}