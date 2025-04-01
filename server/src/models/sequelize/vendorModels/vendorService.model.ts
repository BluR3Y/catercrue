import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    Sequelize,
    BelongsToGetAssociationMixin,
    HasOneGetAssociationMixin
} from "sequelize";
import type { Vendor } from "./vendor.model";
import type { IndustryService } from "./industryService.model";

export class VendorService extends Model<InferAttributes<VendorService>, InferCreationAttributes<VendorService>> {
    public id!: CreationOptional<string>;
    public vendor_id!: CreationOptional<string>;
    public service_id!: number;

    // Sequelize defined association method
    public getVendor!: BelongsToGetAssociationMixin<Vendor>;

    public getService!: HasOneGetAssociationMixin<IndustryService>;
}

export const initVendorServiceModel = (sequelize: Sequelize) => {
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
                type: DataTypes.INTEGER,
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
            sequelize,
            timestamps: true
        }
    );
}

export const associateVendorServiceModel = (orm: {
    Vendor: typeof Vendor;
    IndustryService: typeof IndustryService;
}) => {
    VendorService.belongsTo(orm.Vendor, {
        foreignKey: 'vendor_id',
        as: 'vendor'
    });
    VendorService.hasOne(orm.IndustryService, {
        foreignKey: 'service_id',
        as: 'service'
    });
}