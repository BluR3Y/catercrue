import { Document, Types } from "mongoose";

export interface IShift extends Document {
    eventId: Types.ObjectId;
    coordinatorId: Types.ObjectId;
    workerId: Types.ObjectId;
    role: string;
    shiftStart: Date;
    shiftEnd: Date;
    createdAt?: Date;
    updatedAt?: Date;
}