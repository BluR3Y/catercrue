import { Document, Types } from "mongoose";

export interface IShift extends Document {
    event: Types.ObjectId;
    assigner: Types.ObjectId;
    assignerRef: 'Vendor' | 'Client';
    worker: Types.ObjectId;
    role: number;
    shiftStart: Date;
    shiftEnd: Date;
    createdAt?: Date;
    updatedAt?: Date;
}