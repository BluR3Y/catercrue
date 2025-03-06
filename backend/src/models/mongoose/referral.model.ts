import { Schema, Types, Document, model } from "mongoose";

interface IReferral extends Document {
    referrer: Types.ObjectId;
    listingId: Types.ObjectId;
    contractorId: Types.ObjectId;
    createdAt?: Date;
}

const referralSchema = new Schema<IReferral>(
    {
        referrer: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Coordinator'
        },
        listingId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Listing'
        },
        contractorId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Contractors'
        }
    },
    {
        collection: 'referrals',
        timestamps: { createdAt: true, updatedAt: false }
    }
);

export default model<IReferral>("Referral", referralSchema);