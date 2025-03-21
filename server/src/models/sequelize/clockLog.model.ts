import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { getSequelizeInstance } from "../../config/postgres";

class ClockLog extends Model<InferAttributes<ClockLog>, InferCreationAttributes<ClockLog>> {
    public id!: CreationOptional<string>;
    public shift_id!: string;

    public readonly clockIn!: CreationOptional<Date>;
    public readonly clockOut!: CreationOptional<Date>;
}

ClockLog.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        shift_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        clockIn: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
        clockOut: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        tableName: 'clock_logs',
        modelName: 'ClockLog',
        sequelize: getSequelizeInstance(),
        timestamps: false
    }
);

export default ClockLog;