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
        description: {
            type: Schema.Types.String
        },
        businessAddress: {
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
        industry: {
            type: Schema.Types.Number,
            required: true
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
        services: [{
            type: Schema.Types.Number,
            required: true
        }],
        employees: [employeeSchema]
    },
    {
        timestamps: true,
        collection: 'caterers'
    }
);

// Search by location
vendorSchema.index({ location: "2dsphere" });

export default model<IVendor>("Vendor", vendorSchema);