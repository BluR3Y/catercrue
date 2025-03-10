import { Schema, model, Document, Types } from "mongoose";

export interface IAchievement extends Document {
    description: String;
    location: {
        type: 'Point';
        coordinates: [number, number];
    };
    givenAt: Date;
}

export const achievementSchema = new Schema<IAchievement>(
    {
        description: {
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
        givenAt: {
            type: Schema.Types.Date,
            required: true
        }
    }
);

achievementSchema.index({ location: '2dsphere' });