import { Document, model, Schema, Types } from "mongoose";

interface IListingApplication extends Document {
    listingId: Types.ObjectId;
    contractorId: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const listingApplicationSchema = new Schema<IListingApplication>(
    {
        listingId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Listing'
        },
        contractorId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Contractor'
        }
    },
    {
        collection: 'listing_applications',
        timestamps: true
    }
);

export default model<IListingApplication>("ListingApplication", listingApplicationSchema);