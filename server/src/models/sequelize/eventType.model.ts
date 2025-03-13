import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { getSequelizeInstance } from "../../config/postgres";


class EventType extends Model<InferAttributes<EventType>, InferCreationAttributes<EventType>> {
    public id!: CreationOptional<string>;
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
            type: new DataTypes.STRING(128),
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