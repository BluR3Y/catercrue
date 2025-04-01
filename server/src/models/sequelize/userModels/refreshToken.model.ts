import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, Sequelize, BelongsToGetAssociationMixin } from "sequelize";
import crypto from "crypto";

import type { User } from "./user.model";

export class RefreshToken extends Model<InferAttributes<RefreshToken>, InferCreationAttributes<RefreshToken>> {
    public id!: CreationOptional<string>;
    public user_id!: CreationOptional<string>;

    public readonly expiry!: CreationOptional<Date>;
    public readonly createdAt!: CreationOptional<Date>;

    public getUser!: BelongsToGetAssociationMixin<User>;

    public isExpired(): boolean {
        return new Date() > this.expiry;
    }
}

export const initRefreshTokenModel = (sequelize: Sequelize) => {
    const { REFRESH_TOKEN_DURATION } = process.env;
    if (!REFRESH_TOKEN_DURATION) {
        throw new Error("Refresh Token duration is not defined in environment variables.");
    }

    RefreshToken.init(
        {
            id: {
                type: DataTypes.STRING(255),
                defaultValue: () => crypto.randomBytes(32).toString("hex"),
                primaryKey: true,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },
            expiry: {
                type: DataTypes.DATE,
                defaultValue: function() {
                    const duration = Number(REFRESH_TOKEN_DURATION);
                    return new Date(Date.now() + duration * 1000);
                },
                allowNull: false
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            }
        },
        {
            tableName: 'refresh_tokens',
            modelName: 'RefreshToken',
            sequelize,
            indexes: [
                { fields: ['user_id'] },
                { fields: ['expiry'] }
            ],
            timestamps: true,
            updatedAt: false
        }
    );
    
    // Prevent expiry updates
    RefreshToken.beforeUpdate(() => {
        throw new Error("Record cannot be updated.");
    });
}

export const associateRefreshTokenModel = (orm : {
    User: typeof User
}) => {
    RefreshToken.belongsTo(orm.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
}