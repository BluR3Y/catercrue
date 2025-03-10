import { model, Schema, Types } from "mongoose";

interface ICoordinator extends Document {
    userId: string;
    // services: Array<'Menu Planning' | 'Food Preparation' | 'Delivery' | 'Setup' | 'Staffing' | 'Cleaning' | 'Rentals'>;
    employees: {
        workerId: Types.ObjectId;
        role: string;
    }[];
    createdAt?: Date;
    updatedAt?: Date;
}

const coordinatorSchema = new Schema<ICoordinator>(
    {
        userId: {
            type: Schema.Types.String,
            required: true
        },
        employees: [{
            workerId: {
                type: Schema.Types.ObjectId,
                required: true
            },
            role: {
                type: Schema.Types.String,
                required: true
            }
        }]
    },
    {
        timestamps: true,
        collection: 'coordinators'
    }
);

export default model<ICoordinator>("Coordinator", coordinatorSchema);