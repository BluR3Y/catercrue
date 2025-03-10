import { Schema, model, Document, Types } from "mongoose";

export interface IWorker extends Document {
    userId: string;
    availability: {
        weekDay: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
        timeSlots: {
            start: string;
            end: string;
        }[];
    }[];
    exceptions: {
        date: Date;
        timeSlots: {
            start: string;
            end: string;
        }[];
        isAvailable: boolean;
    }[];
    createdAt?: Date;
    updatedAt?: Date;
    variant: string;
}
export const workerSchema = new Schema<IWorker>(
    {
        userId: {
            type: Schema.Types.String,
            required: true
        },
        availability: [
            {
                weekDay: {
                    type: String,
                    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                    required: true,
                },
                timeSlots: [
                    {
                        start: { type: String, required: true, match: /^([01]\d|2[0-3]):([0-5]\d)$/ },
                        end: { type: String, required: true, match: /^([01]\d|2[0-3]):([0-5]\d)$/ }
                    }
                ]
            }
        ],
        exceptions: [
            {
                date: { type: Date, required: true },
                timeSlots: [
                    {
                        start: { type: String, required: true, match: /^([01]\d|2[0-3]):([0-5]\d)$/ },
                        end: { type: String, required: true, match: /^([01]\d|2[0-3]):([0-5]\d)$/ }
                    }
                ],
                isAvailable: {
                    type: Boolean,
                    required: true
                }
            }
        ]
    },
    {
        timestamps: true,
        collection: 'workers',
        discriminatorKey: 'variant'
    }
);

workerSchema.index({ userId: 1 });
workerSchema.index({ 'exceptions.date': 1 });