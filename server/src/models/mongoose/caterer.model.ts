import { Schema, model } from "mongoose";
import { ICaterer, IEmployee, CatererServices } from "@/types/models";

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

const catererSchema = new Schema<ICaterer>(
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
            type: Schema.Types.String,
            required: true,
            enum: Object.values(CatererServices)
        }]
    },
    {
        timestamps: true,
        collection: 'caterers'
    }
);

// Search by location
catererSchema.index({ location: "2dsphere" });

export default model<ICaterer>("Caterer", catererSchema);