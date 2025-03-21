import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    Sequelize,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyHasAssociationMixin,
    HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin
} from "sequelize";
import type { Password } from "./password.model";
import type { RefreshToken } from "./refreshToken.model";
import type { LoginAttempt } from "./loginAttempt.model";
import type { ContactMethod } from "./contactMethod.model";
import type { Worker } from "../workerModels/worker.model";
import type { Vendor } from "../vendorModels/vendor.model";

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    public id!: CreationOptional<string>;
    public firstName!: string;
    public lastName!: string;
    public avatarUrl!: CreationOptional<string>;

    public readonly createdAt!: CreationOptional<Date>;
    public readonly updatedAt!: CreationOptional<Date>;

    // Sequelize created association methods
    public getPasswords!: HasManyGetAssociationsMixin<Password>;
    public addPassword!: HasManyAddAssociationMixin<Password, number>;
    public hasPassword!: HasManyHasAssociationMixin<Password, number>;
    public countPasswords!: HasManyCountAssociationsMixin;
    public createPassword!: HasManyCreateAssociationMixin<Password>;
    // ** Note: Missing for other association
}

export const initUserModel = (sequelize: Sequelize) => {
    User.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            firstName: {
                type: new DataTypes.STRING(128),
                allowNull: false
            },
            lastName: {
                type: new DataTypes.STRING(128),
                allowNull: false
            },
            avatarUrl: {
                type: new DataTypes.STRING(255),
                allowNull: true,
                validate: {
                    isUrl: true,
                    isValidUrl(value: string) {
                        if (value && !/^https?:\/\/.+/.test(value)) {
                            throw new Error("Avatar URL must start with http:// or https://");
                        }
                    }
                }
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false
            }
        },
        {
            tableName: 'users',
            modelName: 'User',
            sequelize,
            timestamps: true
        }
    );

    // Hook triggered before saving (creating/updating)
    User.beforeSave((user) => {
        if (user.changed('firstName')) {
            user.firstName = user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1);
        }
        if (user.changed('lastName')) {
            user.lastName = user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1);
        }
    });
}

export const associateUserModel = (orm:{
    Password: typeof Password;
    RefreshToken: typeof RefreshToken;
    LoginAttempt: typeof LoginAttempt;
    ContactMethod: typeof ContactMethod;
    Worker: typeof Worker;
    Vendor: typeof Vendor;
}) => {
    User.hasMany(orm.Password, {
        foreignKey: 'user_id',
        as: 'Passwords'
    });
    User.hasMany(orm.RefreshToken, {
        foreignKey: 'user_id',
        as: 'RefreshTokens'
    });
    User.hasMany(orm.LoginAttempt, {
        foreignKey: 'user_id',
        as: 'LoginAttempts'
    });
    User.hasMany(orm.ContactMethod, {
        foreignKey: 'user_id',
        as: 'ContactMethods'
    });
    // User.hasOne(Client, {
    //     foreignKey: 'user_id',
    //     as: 'Client'
    // });
    User.hasOne(orm.Worker, {
        foreignKey: 'user_id',
        as: 'Worker'
    });
    User.hasOne(orm.Vendor, {
        foreignKey: 'user_id',
        as: 'Vendor'
    });
}