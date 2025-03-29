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
    HasManyCreateAssociationMixin,
    HasOneGetAssociationMixin,
    HasOneCreateAssociationMixin
} from "sequelize";
import type { Password } from "./password.model";
import type { RefreshToken } from "./refreshToken.model";
import type { LoginAttempt } from "./loginAttempt.model";
import type { Coordinator } from "../vendorModels/coordinator.model";
import type { Worker } from "../workerModels/worker.model";

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    public id!: CreationOptional<string>;
    public firstName!: string;
    public lastName!: string;
    public phone!: string;
    public email!: CreationOptional<string>;
    public primaryContact!: CreationOptional<string>;
    public avatarUrl!: CreationOptional<string>;

    public readonly createdAt!: CreationOptional<Date>;
    public readonly updatedAt!: CreationOptional<Date>;

    // Sequelize created association methods
    public getPasswords!: HasManyGetAssociationsMixin<Password>;
    public addPassword!: HasManyAddAssociationMixin<Password, string>;
    public hasPassword!: HasManyHasAssociationMixin<Password, string>;
    public countPasswords!: HasManyCountAssociationsMixin;
    public createPassword!: HasManyCreateAssociationMixin<Password>;

    public getRefreshTokens!: HasManyGetAssociationsMixin<RefreshToken>;
    public createRefreshToken!: HasManyCreateAssociationMixin<RefreshToken>;
    
    public getWorker!: HasOneGetAssociationMixin<Worker>;
    public createWorker!: HasOneCreateAssociationMixin<Worker>;

    public getCoordinator!: HasOneGetAssociationMixin<Coordinator>;
    public createCoordinator!: HasOneCreateAssociationMixin<Coordinator>;
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
            phone: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isValidPhone(value: string) {
                        const phoneRegex = /^\+?[1-9]\d{1,14}$/;    // Follows E.164 format
                        if (!phoneRegex.test(value)) {
                            throw new Error('Invalid phone number format');
                        }
                    }
                }
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                validate: {
                    isValidEmail(value: string) {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(value)) {
                            throw new Error('Invalid email format');
                        }
                    }
                }
            },
            primaryContact: {
                type: DataTypes.ENUM(...['phone', 'email']),
                allowNull: false,
                defaultValue: 'phone'
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
        if (user.changed('email')) {
            user.email = user.email.toLowerCase().trim();
        }
    });
}

export const associateUserModel = (orm:{
    Password: typeof Password;
    RefreshToken: typeof RefreshToken;
    LoginAttempt: typeof LoginAttempt;
    Worker: typeof Worker;
    Coordinator: typeof Coordinator;
}) => {
    User.hasMany(orm.Password, {
        foreignKey: 'user_id',
        as: 'passwords'
    });
    User.hasMany(orm.RefreshToken, {
        foreignKey: 'user_id',
        as: 'refreshTokens'
    });
    User.hasMany(orm.LoginAttempt, {
        foreignKey: 'user_id',
        as: 'loginAttempts'
    });
    
    User.hasOne(orm.Worker, {
        foreignKey: 'user_id',
        as: 'worker'
    });
    User.hasOne(orm.Coordinator, {
        foreignKey: 'user_id',
        as: 'coordinator'
    });
}