import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
// import { randomUUID } from "crypto";
import Device from "./device.model";

interface RefreshTokenAttributes {
    id: string;
    token?: string;
    deviceId: string;
    expiry?: Date;
}

interface RefreshTokenCreationAttributes extends Optional<RefreshTokenAttributes, 'id'> {}

class RefreshToken extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes>
    implements RefreshTokenAttributes {
        public id!: string;
        public token!: string;
        public deviceId!: string;

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
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        deviceId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Device,
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
Device.hasMany(RefreshToken, { foreignKey: 'deviceId', as: 'refreshTokens' });
RefreshToken.belongsTo(Device, { foreignKey: 'deviceId', as: 'device' });

export default RefreshToken;