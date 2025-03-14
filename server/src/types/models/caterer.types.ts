import { Document, Types } from "mongoose";

// export type services = 'food' | 'beverage' | 'equipment' | 'staffing' | 'planning' | 'other';
export enum CatererServices {
    staffing = "staffing",
    food_preparation = "food preparation",
    equipment = "equipment",
    coordination = "coordination",
    delivery = "coordinator"
}

export interface IContact extends Document {
    phone: string;
    email: string;
    website?: string;
}

export interface IEmployee extends Document {
    worker: Types.ObjectId;
    role: number;
}

export interface ICaterer extends Document {
    name: string;
    userId: string;
    location: {
        type: 'Point';
        coordinates: [number, number];
    };
    services: ReadonlyArray<CatererServices>;
    contact: IContact;
    employees: IEmployee[];
}