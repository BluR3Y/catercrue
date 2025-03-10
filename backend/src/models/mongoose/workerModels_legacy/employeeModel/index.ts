import { Schema, model, Document, Types } from "mongoose";
import { IWorker } from "../worker.schema";

export interface IEmployee extends IWorker {
    coordinatorId: Types.ObjectId
}

export const employeeSchema = new Schema<IEmployee>({
    coordinatorId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Coordinator'
    }
});