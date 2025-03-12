import { Schema } from "mongoose";
import { IListing } from "@/types";

export const listingSchema = new Schema<IListing>(
    {
        isPrivate: {
            type: Schema.Types.Boolean,
            default: false
        },
        coordinatorId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Coordinators'
        },
        position: {
            type: Schema.Types.String,
            required: true
        },
        description: {
            type: Schema.Types.String,
            required: true
        }
    },
    {
        collection: 'listings',
        discriminatorKey: 'variant',
        timestamps: true
    }
);