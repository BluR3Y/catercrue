import { DataTypes, Model, Optional } from "sequelize";
import { getSequelizeInstance } from "../../config/postgres";
import { Op } from "sequelize";

interface EventStaffAttributes {
    id: string;
    eventId: string;
    userId: string;
    roleId: string;
    shiftStart: Date;
    shiftEnd: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

interface EventStaffCreationAttributes extends Optional<EventStaffAttributes, 'id'> {}

class EventStaff extends Model<EventStaffAttributes, EventStaffCreationAttributes>
    implements EventStaffAttributes {
        public id!: string;
        public eventId!: string;
        public userId!: string;
        public roleId!: string;
        public shiftStart!: Date;
        public shiftEnd!: Date;

        public readonly createdAt!: Date;
        public readonly updatedAt!: Date;

        static async isUserAvailable(userId: string, shiftStart: Date, shiftEnd: Date): Promise<boolean> {
            const conflictingSchedule = await this.findOne({
                where: {
                    userId,
                    [Op.or]: [
                        { shiftStart: { [Op.between]: [shiftStart, shiftEnd] } },
                        { shiftEnd: { [Op.between]: [shiftStart, shiftEnd] } },
                        { shiftStart: { [Op.lte]: shiftStart }, shiftEnd: { [Op.gte]: shiftEnd } }
                    ]
                }
            });
            return !conflictingSchedule;
        }
    }

EventStaff.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        eventId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'events',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'staff_roles',
                key: 'id'
            }
        },
        shiftStart: {
            type: DataTypes.DATE,
            allowNull: false
        },
        shiftEnd: {
            type: DataTypes.DATE,
            allowNull: false
        }
    },
    {
        tableName: 'event_staff',
        modelName: 'EventStaff',
        sequelize: getSequelizeInstance(),
        indexes: [
            {
                unique: true,
                fields: ["eventId", "userId", "roleId"]
            }
        ]
    }
);

export default EventStaff;