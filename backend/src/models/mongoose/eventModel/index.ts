import { Document, model, Schema, Types } from "mongoose";
import { IItinerary, itinerarySchema } from "./itinerary.schema";

interface IEvent extends Document {
    coordinatorId: Types.UUID;
    eventTypeId: string;
    location: {
        type: 'Point';
        coordinates: [number, number];
    };
    eventStaff: Types.ObjectId[];
    itinerary?: IItinerary;
    scheduledDate: Date;
    duration: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const eventSchema = new Schema<IEvent>(
    {
        coordinatorId: {
            type: Schema.Types.UUID,
            required: true
        },
        eventTypeId: {
            type: Schema.Types.String,
            required: true
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
        eventStaff: [{
            type: Schema.Types.ObjectId,
            ref: 'EventStaff'
        }],
        itinerary: {
            type: itinerarySchema
        },
        scheduledDate: {
            type: Schema.Types.Date,
            required: true
        },
        duration: {
            type: Schema.Types.Number,
            required: true
        }
    },
    {
        timestamps: true,
        collection: 'events'
    }
);

// Quicker query by location
eventSchema.index({ location: '2dsphere' });
// Quicker query by coordinatorId
eventSchema.index({ coordinatorId: 1 });
// Quicker query by scheduledDate
eventSchema.index({ scheduledDate: 1 });

export default model<IEvent>("Event", eventSchema);