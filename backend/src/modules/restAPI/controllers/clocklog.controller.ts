import { Request, Response, NextFunction, RequestHandler } from "express";
import orm from "../../../models";

export const clockIn: RequestHandler = async (req, res, next) => {
    try {
        const user = req.user as any;
        const { eventId } = req.body;

        // Verify the user is assigned to the event
        const staffRecord = await orm.EventStaff.findOne({
            where: { eventId, userId: user.id }
        });
        if (!staffRecord) {
            res.status(403).json({ message: "User is not assigned to this event" });
            return;
        }

        // Check if there's already an active clock in (clockOut is null)
        const activeClock = await orm.ClockLog.findOne({
            where: { eventStaffId: staffRecord.id, clockOut: null }
        });
        if (activeClock) {
            res.status(400).json({ message: "Already clocked in" });
        }

        // Create a new clock log record with the current time as clockIn
        const clockLog = await orm.ClockLog.create({ eventStaffId: staffRecord.id });

        res.status(201).json(clockLog);
    } catch (err) {
        next(err);
    }
}

export const clockOut: RequestHandler = async (req, res, next) => {
    try {
        const user = req.user as any;
        const { eventId } = req.body;

        // Verify the user is assigned to the event
        const eventStaff = await orm.EventStaff.findOne({
            where: { eventId, userId: user.id }
        });
        if (!eventStaff) {
            res.status(403).json({ message: "User not assigned to this event" });
            return;
        }

        // Find active clock log
        const activeClockLog = await orm.ClockLog.findOne({
            where: {
                eventStaffId: eventStaff.id,
                clockOut: null
            }
        });
        if (!activeClockLog) {
            res.status(400).json({ message: "No active clock in found" });
            return;
        }

        // Update the active clock log with the clockout time
        activeClockLog.clockOut = new Date();
        await activeClockLog.save();

        res.json(activeClockLog);
    } catch (err) {
        next(err);
    }
}
// Time Zones:
// Ensure that the timestamps are stored in a consistent time zone (e.g., UTC) and convert appropriately on the client side if needed.

// Edge Cases:
// Consider cases where a user might forget to clock out or attempts to clock in/out multiple times. You might implement additional checks or even automated reminders.

// Auditing:
// You might want to keep a history of clock in/out logs for reporting purposes (e.g., hours worked, overtime).

// Frontend Integration:
// Provide a clear UI that shows the current clock status (e.g., “Clock In” button if not clocked in, “Clock Out” button if clocked in).

// Security:
// Make sure to protect these endpoints via authentication middleware so that only authorized users can clock in/out.

