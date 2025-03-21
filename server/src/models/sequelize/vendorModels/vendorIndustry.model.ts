import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    Sequelize,
    HasManyGetAssociationsMixin,
    HasManyCountAssociationsMixin
} from "sequelize";
import type { IndustryService } from "./industryService.model";
import type { IndustryRole } from "../workerModels/industryRole.model";

export class VendorIndustry extends Model<InferAttributes<VendorIndustry>, InferCreationAttributes<VendorIndustry>> {
    public id!: CreationOptional<number>;
    public name!: string;
    public description!: CreationOptional<string>;

    // Sequelize defined association methods
    public getServices!: HasManyGetAssociationsMixin<IndustryService>;
    public countServices!: HasManyCountAssociationsMixin;
    public getRoles!: HasManyGetAssociationsMixin<IndustryRole>;
    public countRoles!: HasManyCountAssociationsMixin;
}

export const initVendorIndustryModel = (sequelize: Sequelize) => {
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
            sequelize,
            timestamps: false
        }
    );
}

export const associateVendorIndustryModel = (orm: {
    IndustryService: typeof IndustryService;
    IndustryRole: typeof IndustryRole;
}) => {
    VendorIndustry.hasMany(orm.IndustryService, {
        foreignKey: 'industry_id',
        as: 'services'
    });
    VendorIndustry.hasMany(orm.IndustryRole, {
        foreignKey: 'industry_id',
        as: 'roles'
    });
}