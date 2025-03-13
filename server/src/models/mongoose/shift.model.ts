import { model, Schema } from "mongoose";
import { IShift } from "@/types";

const shiftSchema = new Schema<IShift>(
    {
        eventId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Event'
        },
        coordinatorId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Coordinator'
        },
        workerId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Worker'
        },
        role: {
            type: Schema.Types.String,
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

// Quicker querying by userId
shiftSchema.index({ workerId: 1 });

export default model<IShift>("Shift", shiftSchema);