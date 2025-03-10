import {model} from "mongoose";

import { IWorker, workerSchema } from "./worker.schema";
import { IContractor, contractorSchema } from "./contractorModel";
import { IEmployee, employeeSchema } from "./employeeModel";

export const workerModel = model<IWorker>("Worker", workerSchema);

export const contractorModel = workerModel.discriminator<IContractor>("Contractor", contractorSchema);

export const employeeModel = workerModel.discriminator<IEmployee>("Employee", employeeSchema);