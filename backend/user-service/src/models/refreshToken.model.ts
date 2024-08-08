import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import User from "./user.model";
import { randomUUID } from "crypto";

interface RefreshTokenAttributes {
    id?: string;
    token?: string;
    userId: string;
    expiredAt?: Date;
}

interface RefreshTokenCreationAttributes extends Optional<RefreshTokenAttributes, 'id'> {}

class RefreshToken extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes>
    implements RefreshTokenAttributes {
        public id?: string;
        public token?: string;
        public userId!: string;

        public readonly expiredAt?: Date;
    }

RefreshToken.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        token: {
            type: DataTypes.UUID,
            defaultValue: randomUUID(),
            allowNull: false
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        expiredAt: {
            type: DataTypes.DATE,
            defaultValue: function() {
                let expiredAt = new Date();
                expiredAt.setSeconds(expiredAt.getSeconds() + parseInt(process.env.REFRESH_TOKEN_DURATION!));
                return expiredAt.getTime();
            },
            allowNull: false
        }
    },
    {
        tableName: 'refresh_tokens',
        modelName: 'RefreshToken',
        sequelize
    }
);
// Last Here

export default RefreshToken;