import { Sequelize } from "sequelize";
import { Coordinator, initCoordinatorModel, associateCoordinatorModel } from "./coordinator.model";

export const initCoordinatorModels = (sequelize: Sequelize) => {
    // Initialize Coordinator related models
    initCoordinatorModel(sequelize);

    return {
        Coordinator
    }
}

export const associateCoordinatorModels = (orm: any) => {
    associateCoordinatorModel(orm);
}