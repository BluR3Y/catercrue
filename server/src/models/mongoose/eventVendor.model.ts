import { model, Schema } from "mongoose";
import { IEventVendor } from "@/types/models";

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
            type: Schema.Types.Number,
            required: true
        }]
    }
);

export default model<IEventVendor>("EventVendor", eventVendorSchema);