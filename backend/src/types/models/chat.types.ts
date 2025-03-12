import { Document, Types } from "mongoose";

export interface IChat extends Document {
    name: string;
    admin: string;
    members: string[];
    createdAt?: Date;
    updatedAt?: Date;
}