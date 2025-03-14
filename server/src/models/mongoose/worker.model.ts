import { model, Schema } from "mongoose";
import { IWorker, WeekDay } from "@/types/models";

const workerSchema = new Schema<IWorker>(
    {
        userId: {
            type: String,
            required: true
        },
        availability: [
            {
                weekDay: {
                    type: String,
                    enum: Object.values(WeekDay),
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
                },
                reason: {
                    type: String
                }
            }
        ]
    },
    {
        timestamps: true,
        collection: 'workers'
    }
);

workerSchema.index({ userId: 1 });
workerSchema.index({ 'exceptions.date': 1 });

export default model<IWorker>("Worker", workerSchema);