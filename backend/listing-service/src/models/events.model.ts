import { Schema, model, Document } from "mongoose";
import validator from "validator";

interface DurationAttributes {
    start: Date,
    end: Date
}

const durationSchema = new Schema<DurationAttributes>({
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    }
});

interface EventAttributes extends Document {
    coordinator: string;
    venueSectionId: string;
    eventTypeId: string;
    duration: DurationAttributes;
    numGuests: number;
    description: string;
    specialRequest: string;
}

const eventSchema = new Schema<EventAttributes>({
    coordinator: {
        type: String,
        required: true,
        validate: {
            validator: (id) => validator.isUUID(id, 4),
            message: 'Invalid Id provided'
        }
    },
    venueSectionId: {
        type: String,
        required: true,
        validate: {
            validator: (id) => validator.isUUID(id, 4),
            message: 'Invalid Id provided'
        }
    },
    eventTypeId: {
        type: String,
        required: true,
        validate: {
            validator: (id) => validator.isUUID(id, 4),
            message: 'Invalid Id provided'
        }
    },
    duration: durationSchema,
    numGuests: {
        type: Number,
        required: true,
        min: 1
    },
    description: {
        type: String,
        maxlength: 600
    },
    specialRequest: {
        type: String,
        maxlength: 600
    }
}, {
    collection: 'events',
    discriminatorKey: 'variant',
    timestamps: true
});

const Event = model<EventAttributes>('Event', eventSchema);

export default Event;
export { EventAttributes };