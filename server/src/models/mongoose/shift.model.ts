import {  model, Schema } from "mongoose";
import { IShift } from "@/types";

const shiftSchema = new Schema<IShift>(
    {
        event: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Events'
        },
        assigner: {
            type: Schema.Types.ObjectId,
            required: true,
            refPath: 'assignerRef'
        },
        assignerRef: {
            type: String,
            required: true,
            enum: ['Caterer', 'Client']
        },
        worker: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Worker'
        },
        role: {
            type: Schema.Types.Number,
            required: true
        },
        shiftStart: {
            type: Schema.Types.Date,
            required: true
        },
        shiftEnd: {
            type: Schema.Types.Date,
            required: true
        }
    },
    {
        timestamps: true,
        collection: 'shifts'
    }
);

export default model<IShift>("Shift", shiftSchema);