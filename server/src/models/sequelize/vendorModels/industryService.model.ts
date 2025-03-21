import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, Sequelize } from "sequelize";

export class IndustryService extends Model<InferAttributes<IndustryService>, InferCreationAttributes<IndustryService>> {
    public id!: CreationOptional<number>;
    public industry_id!: number;
    public name!: string;
    public description!: CreationOptional<string>;
}

export const initIndustryServiceModel = (sequelize: Sequelize) => {
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
            sequelize,
            timestamps: false
        }
    );
}

export const associateIndustryServiceModel = (orm: {
    
}) => {
    
}