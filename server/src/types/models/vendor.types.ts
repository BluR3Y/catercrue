import { Document, Types } from "mongoose";
import { ILocation } from "./shared.types";

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
    description: string;
    industry: number;
    businessAddress: ILocation;
    services: number[];
    contact: IContact;
    employees: IEmployee[];
}