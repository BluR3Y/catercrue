import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, Sequelize } from "sequelize";

export class IndustryRole extends Model<InferAttributes<IndustryRole>, InferCreationAttributes<IndustryRole>> {
    public id!: CreationOptional<number>;
    public industry_id!: number;
    public name!: string;
    public description!: CreationOptional<string>;
}

export const initIndustryRoleModel = (sequelize: Sequelize) => {
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
            sequelize,
            timestamps: false
        }
    );
}

export const associateIndustryRoleModel = (orm: {

}) => {
    
}