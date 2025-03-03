import { DataTypes, Model, Optional } from "sequelize";
import { getSequelizeInstance } from "../../config/postgres";

interface EventItineraryAttributes {
    id: string;
    eventId: string;
    title: string;
    numAttendees: number;
    description: string;
    updatedAt?: Date;
}

interface EventItineraryCreationAttributes extends Optional<EventItineraryAttributes, 'id'> {}

class EventItinerary extends Model<EventItineraryAttributes, EventItineraryCreationAttributes>
    implements EventItineraryAttributes {
        public id!: string;
        public eventId!: string;
        public title!: string;
        public numAttendees!: number;
        public description!: string;

        public readonly updatedAt!: Date;
    }

EventItinerary.init(
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
        title: {
            type: DataTypes.STRING(128),
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        numAttendees: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 1000
            }
        }
    },
    {
        tableName: 'event_itineraries',
        modelName: 'EventItinerary',
        sequelize: getSequelizeInstance(),
        timestamps: true,
        createdAt: false
    }
)

export default EventItinerary;