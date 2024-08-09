import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import User from "./user.model";
import { randomUUID } from "crypto";

interface RefreshTokenAttributes {
    id: string;
    token?: string;
    userId: string;
    expiry?: Date;
}

interface RefreshTokenCreationAttributes extends Optional<RefreshTokenAttributes, 'id'> {}

class RefreshToken extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes>
    implements RefreshTokenAttributes {
        public id!: string;
        public token!: string;
        public userId!: string;

        public readonly expiry!: Date;
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
            defaultValue: randomUUID,
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
        expiry: {
            type: DataTypes.DATE,
            defaultValue: function() {
                let expiry = new Date();
                expiry.setSeconds(expiry.getSeconds() + parseInt(process.env.REFRESH_TOKEN_DURATION!));
                return expiry;
            },
            allowNull: false
        }
    },
    {
        tableName: 'refresh_tokens',
        modelName: 'RefreshToken',
        sequelize,
        timestamps: true
    }
);

// Associations
User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' });
RefreshToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default RefreshToken;