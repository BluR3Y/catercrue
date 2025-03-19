import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { getSequelizeInstance } from "../../config/postgres";

class IndustryRole extends Model<InferAttributes<IndustryRole>, InferCreationAttributes<IndustryRole>> {
    public id!: CreationOptional<number>;
    public industry_id!: number;
    public name!: string;
    public description!: CreationOptional<string>;
}

IndustryRole.init(
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
        tableName: 'industry_roles',
        modelName: 'IndustryRole',
        sequelize: getSequelizeInstance(),
        timestamps: false
    }
);

export default IndustryRole;