import { Schema } from "mongoose";
import { IContractListing } from "@/types";

export const contractListingSchema = new Schema<IContractListing>(
    {
        events: [{
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Event'
        }],
        wage: {
            rate: {
                type: Schema.Types.String,
                enum: ['Hour', 'Day'],
                required: true
            },
            amount: {
                type: Schema.Types.Number,
                required: true
            }
        }
    }
);