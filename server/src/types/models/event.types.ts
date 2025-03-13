import { Types, Document } from "mongoose";

export interface IItinerary extends Document {
    title: string;
    description: string;
    numAttendees: number;
    updatedAt?: Date;
}

export interface IEvent extends Document {
    coordinatorId: Types.ObjectId;
    eventType: string;
    status: "drafted" | "scheduled" | "ongoing" | "completed" | "canceled";
    location: {
        type: 'Point';
        coordinates: [number, number];
    };
    scheduledStart: Date;
    scheduledEnd: Date;
    caterers: Types.ObjectId[];
    itinerary?: IItinerary;
    createdAt?: Date;
    updatedAt?: Date;
}