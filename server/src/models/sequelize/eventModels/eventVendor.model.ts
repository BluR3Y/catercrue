import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    Sequelize,
    BelongsToGetAssociationMixin
} from "sequelize";
import type { Event } from "./event.model";

export class EventVendor extends Model<InferAttributes<EventVendor>, InferCreationAttributes<EventVendor>> {
    public id!: CreationOptional<string>;
    public event_id!: string;
    public vendor_id!: string;
    public services!: CreationOptional<string[]>;

    public getEvent!: BelongsToGetAssociationMixin<Event>;
}

export const initEventVendor = (sequelize: Sequelize) => {
    EventVendor.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
            },
            event_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'events',
                    key: 'id'
                }
            },
            vendor_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'vendors',
                    key: 'id'
                }
            },
            services: {
                type: DataTypes.ARRAY(DataTypes.STRING)
            }
        },
        {
            tableName: 'event_vendors',
            modelName: 'EventVendor',
            sequelize,
            timestamps: true
        }
    );
}

export const associateEventVendor = (orm: {
    Event: typeof Event
}) => {
    EventVendor.belongsTo(orm.Event, {
        foreignKey: 'event_id',
        as: 'event'
    });
}