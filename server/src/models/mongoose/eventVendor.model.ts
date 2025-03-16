import { model, Schema } from "mongoose";
import { CatererServices, IEventVendor } from "@/types/models";

const eventVendorSchema = new Schema<IEventVendor>(
    {
        event: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Event'
        },
        vendor: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Vendor'
        },
        services: [{
            type: Schema.Types.String,
            required: true,
            enum: Object.values(CatererServices)
        }]
    }
);

export default model<IEventVendor>("EventVendor", eventVendorSchema);