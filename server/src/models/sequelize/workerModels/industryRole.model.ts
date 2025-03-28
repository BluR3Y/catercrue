import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    Sequelize,
    BelongsToGetAssociationMixin
} from "sequelize";
import type { ServiceIndustry } from "../vendorModels/serviceIndustry.model";

export class IndustryRole extends Model<InferAttributes<IndustryRole>, InferCreationAttributes<IndustryRole>> {
    public id!: CreationOptional<number>;
    public industry_id!: CreationOptional<number>;
    public name!: string;
    public description!: CreationOptional<string>;

    public getIndustry!: BelongsToGetAssociationMixin<ServiceIndustry>;
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
            tableName: 'industry_roles',
            modelName: 'IndustryRole',
            sequelize,
            timestamps: false
        }
    );
}

export const associateIndustryRoleModel = (orm: {
    ServiceIndustry: typeof ServiceIndustry
}) => {
    IndustryRole.belongsTo(orm.ServiceIndustry, {
        foreignKey: 'industry_id',
        as: 'industry'
    });
}