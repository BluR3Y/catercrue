import { model, Schema } from "mongoose";
import { ICoordinator } from "@/types";

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