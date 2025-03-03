import { DataTypes, Model, Optional } from "sequelize";
import { getSequelizeInstance } from "../../config/postgres";

interface ClockLogAttributes {
    id: string;
    eventStaffId: string;
    clockIn?: Date;
    clockOut?: Date | null;
    updatedAt?: Date;
}

interface ClockLogCreationAttributes extends Optional<ClockLogAttributes, 'id'> {}

class ClockLog extends Model<ClockLogAttributes, ClockLogCreationAttributes>
    implements ClockLogAttributes {
        public id!: string;
        public eventStaffId!: string;
        public clockIn!: Date;
        public clockOut?: Date | null;

        public readonly updatedAt!: Date;
    }

ClockLog.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        eventStaffId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'event_staff',
                key: 'id'
            },
            onDelete: "CASCADE"
        },
        clockIn: {
            type: DataTypes.DATE,
            defaultValue: () => Date.now(),
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
        timestamps: true,
        createdAt: false
    }
);

export default ClockLog;