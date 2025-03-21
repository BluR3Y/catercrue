import { Sequelize } from "sequelize";
import { EventType, initEventTypeModel, associateEventTypeModel } from "./eventType.model";
import { Event, initEventModel, associateEventModel } from "./event.model";
import { EventVendor, initEventVendor, associateEventVendor } from "./eventVendor.model";

export const initEventModels = (sequelize: Sequelize) => {
    // Initialize event related models
    initEventTypeModel(sequelize);
    initEventModel(sequelize);
    initEventVendor(sequelize);

    return {
        EventType,
        Event,
        EventVendor
    }
}

export const associateEventModels = (orm: any) => {
    associateEventTypeModel(orm);
    associateEventModel(orm);
    associateEventVendor(orm);
}