import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, Sequelize } from "sequelize";


export class EventType extends Model<InferAttributes<EventType>, InferCreationAttributes<EventType>> {
    public id!: CreationOptional<string>;
    public name!: string;
    public category!: string;
    public description!: string;
}

export const initEventTypeModel = (sequelize: Sequelize) => {
    EventType.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            category: {
                type: DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: DataTypes.STRING
            }
        },
        {
            tableName: 'event_types',
            modelName: 'EventType',
            sequelize,
            timestamps: false
        }
    );
}

export const associateEventTypeModel = (orm: {

}) => {
    
}