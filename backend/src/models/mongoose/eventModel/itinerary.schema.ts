import { Schema } from "mongoose";
import { IItinerary } from "@/types";

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