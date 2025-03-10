import { Document, model, Schema, Types } from "mongoose";

interface IShift extends Document {
    eventId: Types.ObjectId;
    coordinatorId: Types.ObjectId;
    workerId: Types.ObjectId;
    role: string;
    shift: {
        start: Date;
        end: Date;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

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
        shift: {
            start: {
                type: Schema.Types.Date,
                required: true
            },
            end: {
                type: Schema.Types.Date,
                required: true
            }
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