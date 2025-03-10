import { Document, model, Schema, Types } from "mongoose";
import { IItinerary, itinerarySchema } from "./itinerary.schema";

interface IEvent extends Document {
    coordinatorId: Types.ObjectId;  // Event Coordinator
    eventTypeId: string;
    status: 'drafted' | 'scheduled' | 'ongoing' | 'completed' | 'canceled';
    location: {
        type: 'Point';
        coordinates: [number, number];
    };
    scheduledStart: Date;
    scheduledEnd: Date;
    caterers: Types.ObjectId[];
    itinerary?: IItinerary;
    createdAt?: Date;
    updatedAt?: Date;
}

const eventSchema = new Schema<IEvent>(
    {
        coordinatorId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Coordinators'
        },
        eventTypeId: {
            type: Schema.Types.String,
            required: true
        },
        status: {
            type: Schema.Types.String,
            enum: ['scheduled', 'ongoing', 'completed', 'canceled'],
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
        scheduledStart: {
            type: Schema.Types.Date,
            required: true
        },
        scheduledEnd: {
            type: Schema.Types.Date,
            required: true
        },
        caterers: [{
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Coordinators'
        }],
        itinerary: {
            type: itinerarySchema
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