import {model} from "mongoose";

import { IWorker, workerSchema } from "./worker.schema";
import { IContractor, contractorSchema } from "./contractorModel";
import { IEmployee, employeeSchema } from "./employeeModel";

export const workerModel = model<IWorker>("Worker", workerSchema);

export const contractorModel = model<IContractor>("Contractor", contractorSchema);

export const employeeModel = model<IEmployee>("Employee", employeeSchema);