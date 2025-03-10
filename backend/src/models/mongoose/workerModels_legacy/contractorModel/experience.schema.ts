import { Schema, model, Document, Types } from "mongoose";

export interface IExperience extends Document {
    position: string;
    workplace: string;
    location: {
        type: 'Point';
        coordinates: [number, number]; // [longitude, latitude]
    };
    duration: {
        start: Date;
        end?: Date;
    };
}

export const experienceSchema = new Schema<IExperience>(
    {
        position: {
            type: Schema.Types.String,
            required: true
        },
        workplace: {
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
        duration: {
            start: {
                type: Schema.Types.Date,
                required: true
            },
            end: {
                type: Schema.Types.Date,
            }
        }
    }
);

experienceSchema.index({ location: '2dsphere' });   // Index for geospatial queries

// GeoJSON: https://mongoosejs.com/docs/geojson.html