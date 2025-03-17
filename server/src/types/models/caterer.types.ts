import { Document, Types } from "mongoose";

export interface IContact extends Document {
    phone: string;
    email: string;
    website?: string;
}

export interface IEmployee extends Document {
    worker: Types.ObjectId;
    role: number;
}

export interface IVendor extends Document {
    name: string;
    userId: string;
    location: {
        type: 'Point';
        coordinates: [number, number];
    };
    services: number[];
    contact: IContact;
    employees: IEmployee[];
}