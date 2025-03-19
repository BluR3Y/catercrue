import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { getSequelizeInstance } from "../../config/postgres";

class IndustryService extends Model<InferAttributes<IndustryService>, InferCreationAttributes<IndustryService>> {
    public id!: CreationOptional<number>;
    public industry_id!: number;
    public name!: string;
    public description!: CreationOptional<string>;
}

IndustryService.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        industry_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'vendor_industries',
                key: 'id'
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING
        }
    },
    {
        tableName: 'industry_services',
        modelName: 'IndustryService',
        sequelize: getSequelizeInstance(),
        timestamps: false
    }
);

export default IndustryService;