import { model, Schema } from "mongoose";
import { CatererServices, IEventCaterer } from "@/types/models";

const eventCaterers = new Schema<IEventCaterer>(
    {
        event: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Event'
        },
        caterer: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Caterer'
        },
        services: [{
            type: Schema.Types.String,
            required: true,
            enum: Object.values(CatererServices)
        }]
    }
);

export default model<IEventCaterer>("EventCaterer", eventCaterers);