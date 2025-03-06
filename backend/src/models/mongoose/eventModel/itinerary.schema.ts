import { Document, model, Schema, Types } from "mongoose";

export interface IItinerary extends Document {
    title: string;
    description: string;
    numAttendees: number;
    updatedAt?: Date;
}

export const itinerarySchema = new Schema<IItinerary>(
    {
        title: {
            type: Schema.Types.String,
            required: true
        },
        description: {
            type: Schema.Types.String,
            required: true
        },
        numAttendees: {
            type: Schema.Types.Number,
            required: true
        }
    },
    {
        timestamps: {
            createdAt: false,
            updatedAt: true
        }
    }
);