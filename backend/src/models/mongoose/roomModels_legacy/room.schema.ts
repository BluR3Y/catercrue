import { Document, model, Schema, Types } from "mongoose";

export interface IRoom extends Document {
    members: Types.ObjectId[],
    createdAt?: Date;
    updatedAt?: Date;
    variant: string;
}

export const roomSchema = new Schema<IRoom>(
    {
        members: [{
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Workers'
        }]
    },
    {
        timestamps: true,
        collection: 'rooms',
        discriminatorKey: 'variant'
    }
);