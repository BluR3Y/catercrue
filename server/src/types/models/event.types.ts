import { Types, Document } from "mongoose";

export interface IItinerary extends Document {
    title: string;
    description: string;
    numAttendees: number;
    updatedAt?: Date;
}

export enum EventStatuses {
    drafted = "drafted",
    scheduled = "scheduled",
    canceled = "canceled"
    // ongoing = "ongoing",
    // completed = "completed",
}

export interface IEvent extends Document {
    client?: Types.ObjectId;
    eventType: number;
    status: ReadonlyArray<EventStatuses>;
    itinerary?: IItinerary;
    location: {
        type: 'Point';
        coordinates: [number, number];
    };
    scheduledStart: Date;
    scheduledEnd: Date;
    createdAt?: Date;
    updatedAt?: Date;
}