import { Schema, model } from "mongoose";
import { IVendor, IEmployee } from "@/types/models";

const employeeSchema = new Schema<IEmployee>({
    worker: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'workers'
    },
    role: {
        type: Schema.Types.Number,
        required: true
    }
});

const vendorSchema = new Schema<IVendor>(
    {
        userId: {
            type: Schema.Types.String,
            required: true
        },
        name: {
            type: Schema.Types.String,
            required: true,
            unique: true
        },
        location: {
            type: {
                type: Schema.Types.String,
                enum: ['Point'],
                required: true
            },
            coordinates: {
                type: [Schema.Types.Number],
                required: true
            }
        },
        contact: {
            phone: {
                type: Schema.Types.String,
                unique: true
            },
            email: {
                type: Schema.Types.String,
                unique: true
            },
            website: {
                type: Schema.Types.String,
                unique: true
            }
        },
        employees: [employeeSchema],
        services: [{
            type: Schema.Types.Number,
            required: true
        }]
    },
    {
        timestamps: true,
        collection: 'caterers'
    }
);

// Search by location
vendorSchema.index({ location: "2dsphere" });

export default model<IVendor>("Vendor", vendorSchema);