import { Sequelize } from "sequelize";
import { EventType, initEventTypeModel } from "./eventType.model";
import { Event, initEventModel, associateEventModel } from "./event.model";
import { ContractedVendor, initContractedVendorModel, associateContractedVendorModel } from "./contractedVendor.model";

export const initEventModels = (sequelize: Sequelize) => {
    // Initialize event related models
    initEventTypeModel(sequelize);
    initEventModel(sequelize);
    initContractedVendorModel(sequelize);

    return {
        EventType,
        Event,
        ContractedVendor
    }
}

export const associateEventModels = (orm: any) => {
    associateEventModel(orm);
    associateContractedVendorModel(orm);
}