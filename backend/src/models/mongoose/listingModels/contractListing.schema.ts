import { Schema, model, Document, Types } from "mongoose";
import { IListing } from "./listing.schema";

export interface IContractListing extends IListing {
    events: Types.ObjectId[];
    wage: {
        rate: 'Hour' | 'Day';
        amount: number;
    },
    variant: 'ContractListing'
}

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
        },
        variant: 'ContractListing'
    }
);