import { Schema, model, Document, Types } from "mongoose";

export interface IEducation extends Document {
    name: string;
    institute: string;
    location: {
        type: 'Point';
        coordinates: [number, number];
    };
    duration: {
        start: Date;
        end?: Date;
    };
}

export const educationSchema = new Schema<IEducation>(
    {
        name: {
            type: Schema.Types.String,
            required: true
        },
        institute: {
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

educationSchema.index({ location: '2dsphere' });