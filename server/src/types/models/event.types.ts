import { Types, Document } from "mongoose";

export interface IItinerary extends Document {
    title: string;
    description: string;
    numAttendees: number;
    updatedAt?: Date;
}

export enum EventState {
    drafted = "drafted",
    scheduled = "scheduled",
    canceled = "canceled"
}

export interface ISchedule extends Document {
    start: Date;
    end: Date;
}

export interface IEvent extends Document {
    client?: Types.ObjectId;
    eventTypeId: number;
    state: EventState;
    itinerary?: IItinerary;
    location: {
        type: 'Point';
        coordinates: [number, number];
    };
    schedule: ISchedule;
    createdAt?: Date;
    updatedAt?: Date;
}