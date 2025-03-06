import { Document, model, Schema, Types } from "mongoose";

interface IEventStaff extends Document {
    eventId: Types.ObjectId;
    userId: Types.UUID;
    role: string;
    shift: {
        start: Date;
        end: Date;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

const eventStaffSchema = new Schema<IEventStaff>(
    {
        eventId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Event'
        },
        userId: {
            type: Schema.Types.UUID,
            required: true
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
        collection: 'event_staff'
    }
);

// Quicker querying by userId
eventStaffSchema.index({ userId: 1 });

export default model<IEventStaff>("EventStaff", eventStaffSchema);

// Last Here