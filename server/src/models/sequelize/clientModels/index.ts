import { Sequelize } from "sequelize";
import { Client, initClientModel, associateClientModel } from "./client.model";

export const initClientModels = (sequelize: Sequelize) => {
    // Initialize Client related models
    initClientModel(sequelize);

    return {
        Client
    }
}

export const associateClientModels = (orm: any) => {
    associateClientModel(orm);
}