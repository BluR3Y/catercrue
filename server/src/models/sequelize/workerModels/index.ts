import { Sequelize } from "sequelize";
import { IndustryRole, initIndustryRoleModel, associateIndustryRoleModel } from "./industryRole.model";
import { Contractor, initContractorModel, associateContractorModel } from "./contractor.model";
import { Worker, initWorkerModel, associateWorkerModel } from "./worker.model";
import { WorkerAvailability, initWorkerAvailabilityModel, associateWorkerAvailabilityModel } from "./workerAvailability.model";
import { WorkerException, initWorkerExceptionModel, associateWorkerExceptionModel } from "./workerException.model";

export const initWorkerModels = (sequelize: Sequelize) => {
    // Initialize worker models
    initContractorModel(sequelize);
    initIndustryRoleModel(sequelize);
    initWorkerModel(sequelize);
    initWorkerAvailabilityModel(sequelize);
    initWorkerExceptionModel(sequelize);

    return {
        Contractor,
        IndustryRole,
        Worker,
        WorkerAvailability,
        WorkerException
    }
}

export const associateWorkerModels = (orm: any) => {
    associateContractorModel(orm);
    associateIndustryRoleModel(orm);
    associateWorkerModel(orm);
    associateWorkerAvailabilityModel(orm);
    associateWorkerExceptionModel(orm);
}