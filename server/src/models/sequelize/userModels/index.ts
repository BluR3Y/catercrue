import { Sequelize } from "sequelize";
import { User, initUserModel, associateUserModel } from "./user.model";
import { Password, initPasswordModel, associatePasswordModel } from "./password.model";
import { ContactMethod, initContactMethodModel, associateContactMethodModel } from "./contactMethod.model";
import { LoginAttempt, initLoginAttemptModel, associateLoginAttemptModel } from "./loginAttempt.model";
import { RefreshToken, initRefreshTokenModel, associateRefreshTokenModel } from "./refreshToken.model";

export const initUserModels = (sequelize: Sequelize) => {
    // Initialize User related models
    initUserModel(sequelize);
    initPasswordModel(sequelize);
    initContactMethodModel(sequelize);
    initLoginAttemptModel(sequelize);
    initRefreshTokenModel(sequelize);

    return {
        User,
        Password,
        ContactMethod,
        LoginAttempt,
        RefreshToken
    }
}

export const associateUserModels = (orm: any) => {
    // Associate User related models
    associateUserModel(orm);
    associatePasswordModel(orm);
    associateContactMethodModel(orm);
    associateLoginAttemptModel(orm);
    associateRefreshTokenModel(orm);
}