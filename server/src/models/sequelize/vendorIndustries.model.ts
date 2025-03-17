import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { getSequelizeInstance } from "../../config/postgres";

class VendorIndustry extends Model<InferAttributes<VendorIndustry>, InferCreationAttributes<VendorIndustry>> {
    public id!: CreationOptional<number>;
    public name!: string;
    public description!: CreationOptional<string>;
}

VendorIndustry.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING
        }
    },
    {
        tableName: 'vendor_industries',
        modelName: 'VendorIndustry',
        sequelize: getSequelizeInstance(),
        timestamps: false
    }
);

export default VendorIndustry;