import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { getSequelizeInstance } from "../../config/postgres";

class EventVendor extends Model<InferAttributes<EventVendor>, InferCreationAttributes<EventVendor>> {
    public id!: CreationOptional<string>;
    public event_id!: string;
    public vendor_id!: string;
    public services!: CreationOptional<string[]>;
}

EventVendor.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
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
            type: DataTypes.ARRAY
        }
    },
    {
        tableName: 'event_vendors',
        modelName: 'EventVendor',
        sequelize: getSequelizeInstance(),
        timestamps: true
    }
);

export default EventVendor;