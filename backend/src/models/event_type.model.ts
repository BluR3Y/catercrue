import { DataTypes, Model, Optional } from "sequelize";
import { getSequelizeInstance } from "../config/postgres";

interface EventTypeAttributes {
    id: string;
    name: string;
}

interface EventTypeCreationAttributes extends Optional<EventTypeAttributes, 'id'> {}

class EventType extends Model<EventTypeAttributes, EventTypeCreationAttributes>
    implements EventTypeAttributes {
        public id!: string;
        public name!: string;
    }

EventType.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(128),
            allowNull: false
        }
    },
    {
        tableName: 'event_types',
        modelName: 'EventType',
        sequelize: getSequelizeInstance(),
        timestamps: false
    }
);

export default EventType;