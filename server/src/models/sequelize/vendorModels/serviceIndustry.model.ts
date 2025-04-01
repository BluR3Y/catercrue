import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    Sequelize,
    HasManyGetAssociationsMixin,
    HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin
} from "sequelize";
import type { IndustryService } from "./industryService.model";
import type { IndustryRole } from "../workerModels/industryRole.model";

export class ServiceIndustry extends Model<InferAttributes<ServiceIndustry>, InferCreationAttributes<ServiceIndustry>> {
    public id!: CreationOptional<number>;
    public name!: string;
    public description!: CreationOptional<string>;

    // Sequelize defined association methods
    public getServices!: HasManyGetAssociationsMixin<IndustryService>;
    public countServices!: HasManyCountAssociationsMixin;
    public createService!: HasManyCreateAssociationMixin<IndustryService>;
    
    public getRoles!: HasManyGetAssociationsMixin<IndustryRole>;
    public countRoles!: HasManyCountAssociationsMixin;
    public createRole!: HasManyCreateAssociationMixin<IndustryRole>;
}

export const initServiceIndustryModel = (sequelize: Sequelize) => {
    ServiceIndustry.init(
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
            tableName: 'service_industries',
            modelName: 'ServiceIndustry',
            sequelize,
            timestamps: false
        }
    );
}

export const associateServiceIndustryModel = (orm: {
    IndustryService: typeof IndustryService;
    IndustryRole: typeof IndustryRole;
}) => {
    ServiceIndustry.hasMany(orm.IndustryService, {
        foreignKey: 'industry_id',
        as: 'services'
    });
    ServiceIndustry.hasMany(orm.IndustryRole, {
        foreignKey: 'industry_id',
        as: 'roles'
    });
}