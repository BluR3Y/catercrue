import { Document } from "mongoose";

// Define time slot structure
interface TimeSlot {
    start: string;
    end: string;
}

// Define weekly availability structure
interface AvailabilitySlot {
    weekDay: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
    timeSlots: TimeSlot[];
}

// Define exception structure (specific dates)
interface ExceptionSlot {
    date: Date;     // Specific date exception
    timeSlots: TimeSlot[];  // Available/Unavailable time slots
    isAvailable: boolean;   // Defines if worker is available that day
}

// Worker Interface
export interface IWorker extends Document {
    userId: string;
    availability: AvailabilitySlot[];
    exceptions: ExceptionSlot[];
    createdAt?: Date;
    updatedAt?: Date;
}