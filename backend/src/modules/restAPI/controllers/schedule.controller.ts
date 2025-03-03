import { Request, Response, NextFunction, RequestHandler } from "express";
import orm from "../../../models";

export const scheduleUserForEvent: RequestHandler = async (req, res, next) => {
    try {
        const { eventId, userId, roleId, shiftStart, shiftEnd } = req.body;

        // Logic to check if user has authority to make request

        // Check if user is available
        const isAvailable = await orm.EventStaff.isUserAvailable(userId, shiftStart, shiftEnd);
        if (!isAvailable) {
            res.status(400).json({ message: "User is already scheduled for another event during this time." });
            return;
        }

        // Assign user to the event
        const newAssignment = await orm.EventStaff.create({
            eventId,
            userId,
            roleId,
            shiftStart,
            shiftEnd
        });
        res.status(201).json(newAssignment);
    } catch (err) {
        next(err);
    }
}

// Handle Schedule conflicts

export const rejectScheduledShift: RequestHandler = async (req, res, next) => {
    try {
        
    } catch (err) {
        next(err);
    }
}

