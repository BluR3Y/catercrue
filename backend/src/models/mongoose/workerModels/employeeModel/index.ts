import { Schema, model, Document, Types } from "mongoose";
import { IWorker } from "../worker.schema";

export interface IEmployee extends IWorker {

}

export const employeeSchema = new Schema<IEmployee>({
    variant: ''
});