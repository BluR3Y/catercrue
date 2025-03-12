import { model, Schema } from "mongoose";
import { itinerarySchema } from "./itinerary.schema";
import { IEvent } from "@/types";


const eventSchema = new Schema<IEvent>(
    {
        coordinatorId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Coordinators'
        },
        eventType: {
            type: Schema.Types.String,
            required: true
        },
        status: {
            type: Schema.Types.String,
            enum: ['scheduled', 'ongoing', 'completed', 'canceled', 'drafted'],
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
        itinerary: itinerarySchema
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