import { Schema, model, Document, Types } from "mongoose";
import { IWorker } from "../worker.schema";

export interface IEmployee extends IWorker {
    employer: Types.UUID
}

export const employeeSchema = new Schema<IEmployee>({
    employer: {
        type: Schema.Types.UUID,
        required: true
    },
    variant: 'Employee'
});