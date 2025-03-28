import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    Sequelize,
    BelongsToGetAssociationMixin
} from "sequelize";
import type { ServiceIndustry } from "./serviceIndustry.model";

export class IndustryService extends Model<InferAttributes<IndustryService>, InferCreationAttributes<IndustryService>> {
    public id!: CreationOptional<number>;
    public industry_id!: CreationOptional<number>;
    public name!: string;
    public description!: CreationOptional<string>;

    public getIndustry!: BelongsToGetAssociationMixin<ServiceIndustry>;
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
                    model: 'service_industries',
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
    ServiceIndustry: typeof ServiceIndustry
}) => {
    IndustryService.belongsTo(orm.ServiceIndustry, {
        foreignKey: 'industry_id',
        as: 'industry'
    });
}