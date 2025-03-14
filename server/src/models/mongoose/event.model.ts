import { model, Schema } from "mongoose";
import { EventStatuses, IEvent, IItinerary } from "@/types/models";

const itinerarySchema = new Schema<IItinerary>(
    {
        title: {
            type: Schema.Types.String,
            required: true
        },
        description: {
            type: Schema.Types.String,
            required: true
        },
        numAttendees: {
            type: Schema.Types.Number,
            required: true
        }
    },
    {
        timestamps: {
            createdAt: false,
            updatedAt: true
        }
    }
);

const eventSchema = new Schema<IEvent>(
    {
        client: {
            type: Schema.Types.ObjectId
        },
        eventType: {
            type: Schema.Types.Number,
            required: true
        },
        status: {
            type: Schema.Types.String,
            enum: Object.values(EventStatuses),
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
        itinerary: itinerarySchema,
        scheduledStart: {
            type: Schema.Types.Date,
            required: true
        },
        scheduledEnd: {
            type: Schema.Types.Date,
            required: true
        }
    },
    {
        timestamps: true,
        collection: 'events'
    }
);

eventSchema.index({ location: "2dsphere" });

export default model<IEvent>("Event", eventSchema);