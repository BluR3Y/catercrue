import { Document, Types } from "mongoose";

// services: Array<'Menu Planning' | 'Food Preparation' | 'Delivery' | 'Setup' | 'Staffing' | 'Cleaning' | 'Rentals'>;

interface IEmployee {
    workerId: Types.ObjectId;
    role: string;
}

export interface ICoordinator extends Document {
    userId: string;     // Foreign key that references a sequelize (postgres) model with an id of UUID
    employees: IEmployee[];
    createdAt?: Date;
    updatedAt?: Date;
}