import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import User from "./user.model";

interface DeviceAttributes {
    id: string;
    userId: string;
    ipAddress: string;
}

interface DeviceCreationAttributes extends Optional<DeviceAttributes, 'id'> {}

class Device extends Model<DeviceAttributes, DeviceCreationAttributes> implements DeviceAttributes {
    public id!: string;
    public userId!: string;
    public ipAddress!: string;
}

Device.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
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
        ipAddress: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: 'devices',
        modelName: 'Device',
        sequelize,
        timestamps: true
    }
);

// Associations
User.hasMany(Device, { foreignKey: 'userId', as: 'devices' });
Device.belongsTo(User, { foreignKey: 'userId', as: 'user' })

export default Device;