import { Document } from "mongoose";

// Define time slot structure
interface TimeSlot {
    start: string;
    end: string;
}

export enum WeekDay {
    Monday = "Monday",
    Tuesday = "Tuesday",
    Wednesday = "Wednesday",
    Thursday = "Thursday",
    Friday = "Friday",
    Saturday = "Saturday",
    Sunday = "Sunday"
}

// Define weekly availability structure
interface AvailabilitySlot {
    weekDay: Readonly<WeekDay>;
    timeSlots: TimeSlot[];
}

// Define exception structure (specific dates)
interface ExceptionSlot {
    date: Date;     // Specific date exception
    timeSlots: TimeSlot[];  // Available/Unavailable time slots
    isAvailable: boolean;   // Defines if worker is available that day
    reason?: string;
}

// Worker Interface
export interface IWorker extends Document {
    userId: string;
    availability: AvailabilitySlot[];
    exceptions: ExceptionSlot[];
    createdAt?: Date;
    updatedAt?: Date;
}