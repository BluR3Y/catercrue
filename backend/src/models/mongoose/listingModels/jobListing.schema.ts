import { Schema } from "mongoose";
import { IJobListing } from "@/types";

export const jobListingSchema = new Schema<IJobListing>(
    {
        venueId: {
            type: Schema.Types.ObjectId,
            ref: 'Venue'
        },
        location: {
            type: Schema.Types.String
        },
        jobTypes: [{
            type: Schema.Types.String,
            enum: ['Seasonal', 'Full-Time', 'Part-Time', 'Temporary'],
            required: true
        }],
        wage: {
            rate: {
                type: Schema.Types.String,
                enum: ['Hour', 'Day', 'Week', 'Month', 'Year'],
                required: true
            },
            amount: [{
                type: Schema.Types.Number,
                required: true
            }]
        }
    }
);

jobListingSchema.pre('validate', function(next) {
    if (!this.venueId && !this.location) {
        return next(new Error("Atleast venueId or location must be provided"));
    } else if (this.venueId && this.location) {
        return next(new Error("Both venueId and location were provided"));
    }
    next();
});

jobListingSchema.path('wage.amount').validate({
    validator: function(amount: number[]) {
        return amount.length >= 1 && amount.length <= 2;
    },
    message: 'Wage amount must have either 1 (fixed) or 2 (range) values.'
});