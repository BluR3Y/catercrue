import { model, Schema } from "mongoose";
import { EventStates, IEvent, IItinerary, ISchedule } from "@/types/models";
import orm from "../sequelize";
import odm from ".";

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
        _id: false,
        timestamps: {
            createdAt: false,
            updatedAt: true
        }
    }
);

const scheduleSchema = new Schema<ISchedule>(
    {
        start: {
            type: Schema.Types.Date,
            required: true
        },
        end: {
            type: Schema.Types.Date,
            required: true
        }
    }, {
        _id: false
    }
);

scheduleSchema.path('start').validate(function(startTime) {
    return (startTime >= new Date());
}, "Cannot create past event");

const eventSchema = new Schema<IEvent>(
    {
        client: {
            type: Schema.Types.ObjectId,
            ref: 'Client'
        },
        eventTypeId: {
            type: Schema.Types.Number,
            required: true
        },
        state: {
            type: Schema.Types.String,
            enum: Object.values(EventStates),
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
                required: true,
                validate: {
                    validator: function(coords: number[]) {
                        return coords.length === 2;
                    },
                    message: "Coordinates must be an array of [longitude, latitude]"
                }
            }
        },
        itinerary: itinerarySchema,
        schedule: scheduleSchema
    },
    {
        timestamps: true,
        collection: 'events'
    }
);

eventSchema.index({ location: "2dsphere" });

// If no client is associated with event, make sure there is someone coordinating the event, i.e., worker, caterer, etc
eventSchema.pre('save', async function(next) {
    // if (this.client) return next();
    // const eventVendor = await odm.eventVendorModel.find({
    //     event: this.id
    // });
    // Last Here
    const eventCoordinators = this.client ? [this.client] : [];

});

eventSchema.virtual("status").get(function() {
    const status = this.state;
    const { start, end } = this.schedule;
    const currentDate = new Date();
    if (status !== "scheduled" || currentDate < start) return status;
    return (currentDate < end ? "ongoing" : "completed");
});

eventSchema.statics.getEventType = async function(typeId: number) {
    return await orm.EventType.findByPk(typeId);
}

eventSchema.path('eventTypeId').validate(async function(this: any, typeId: string) {
    return !!(await this.constructor.getEventType(typeId));
}, "Invalid Event Type");

eventSchema.path('schedule').validate(function(schedule) {
    return schedule.start < schedule.end;
}, "Invalid schedule configuration");

export default model<IEvent>("Event", eventSchema);