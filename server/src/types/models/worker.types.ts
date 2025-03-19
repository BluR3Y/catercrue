import { Document } from "mongoose";
import { ILocation, ITimeSlot, WeekDay } from "./shared.types";

// Define weekly availability structure
interface AvailabilitySlot {
    weekDay: Readonly<WeekDay>;
    timeSlots: ITimeSlot[];
}

// Define exception structure (specific dates)
interface ExceptionSlot {
    date: Date;     // Specific date exception
    timeSlots: ITimeSlot[];  // Available/Unavailable time slots
    isAvailable: boolean;   // Defines if worker is available that day
    reason?: string;
}

// Worker Interface
export interface IWorker extends Document {
    userId: string;
    dob: Date;
    homeAddress: ILocation;
    availability: AvailabilitySlot[];
    exceptions: ExceptionSlot[];
    createdAt?: Date;
    updatedAt?: Date;
}