import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { getSequelizeInstance } from "../../config/postgres";

class VendorService extends Model<InferAttributes<VendorService>, InferCreationAttributes<VendorService>> {
    public id!: CreationOptional<string>;
    public vendor_id!: string;
    public service_id!: string;
}

VendorService.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        vendor_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'vendors',
                key: 'id'
            }
        },
        service_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'industry_services',
                key: 'id'
            }
        }
    },
    {
        tableName: 'vendor_services',
        modelName: 'VendorService',
        sequelize: getSequelizeInstance(),
        timestamps: true
    }
);

export default VendorService;