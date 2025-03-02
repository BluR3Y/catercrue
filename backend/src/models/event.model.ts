import { DataTypes, Model, Optional } from "sequelize";
import { getSequelizeInstance } from "../config/postgres";
import Contractee from "./contractee.model";
import EventType from "./eventType.model";

interface EventAttributes {
    id: string;
    contracteeId: string;
    eventTypeId: string;
    location: string;
    scheduledDate: Date,
    duration: number;
    createdAt?: Date;
    updatedAt?: Date;
}

interface EventCreationAttributes extends Optional<EventAttributes, 'id'> {}

class Event extends Model<EventAttributes, EventCreationAttributes>
    implements EventAttributes {
        public id!: string;
        public contracteeId!: string;
        public eventTypeId!: string;
        public location!: string;
        public scheduledDate!: Date;
        public duration!: number;
        
        public readonly createdAt!: Date;
        public readonly updatedAt!: Date;
    }

Event.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        contracteeId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Contractee,
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        eventTypeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: EventType,
                key: 'id'
            }
        },
        location: {
            type: DataTypes.GEOMETRY("POINT"),
            allowNull: false
        },
        scheduledDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        tableName: 'events',
        modelName: 'Event',
        sequelize: getSequelizeInstance(),
        timestamps: true
    }
);

export default Event;