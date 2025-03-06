import { Schema, model, Document, Types } from "mongoose";

export interface IListing extends Document {
    position: string;
    description: string;
    createdAt?: Date;
    updatedAt?: Date;
    variant: string;
}

export const listingSchema = new Schema<IListing>(
    {
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