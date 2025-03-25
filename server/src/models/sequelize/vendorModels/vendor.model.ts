import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    Sequelize,
    BelongsToGetAssociationMixin,
    HasManyGetAssociationsMixin,
    HasManyCreateAssociationMixin,
    HasManyCountAssociationsMixin,
    HasOneGetAssociationMixin
} from "sequelize";

import type { User } from "../userModels/user.model";
import type { VendorService } from "./vendorService.model";
import type { EventVendor } from "../eventModels/eventVendor.model";
import type { VendorIndustry } from "./vendorIndustry.model";

export class Vendor extends Model<InferAttributes<Vendor>, InferCreationAttributes<Vendor>> {
    public id!: CreationOptional<string>;
    public user_id!: CreationOptional<string>;
    public business_name!: string;
    public description!: CreationOptional<string>;
    public business_address!: string;
    public industry_id!: number;
    public business_phone!: CreationOptional<string>;
    public business_email!: CreationOptional<string>;
    public business_website!: CreationOptional<string>;

    // Sequelize defined association methods
    public getUser!: BelongsToGetAssociationMixin<User>;

    public getIndustry!: HasOneGetAssociationMixin<VendorIndustry>;

    public getServices!: HasManyGetAssociationsMixin<VendorService>;
    public createService!: HasManyCreateAssociationMixin<VendorService>;

    public getEvents!: HasManyGetAssociationsMixin<EventVendor>;
    public countEvents!: HasManyCountAssociationsMixin;
}

export const initVendorModel = (sequelize: Sequelize) => {
    Vendor.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            business_name: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: true
            },
            description: {
                type: DataTypes.STRING
            },
            business_address: {
                type: DataTypes.GEOMETRY('POINT'),
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
            business_phone: {
                type: DataTypes.STRING
            },
            business_email: {
                type: DataTypes.STRING
            },
            business_website: {
                type: DataTypes.STRING
            }
        },
        {
            tableName: 'vendors',
            modelName: 'Vendor',
            sequelize,
            timestamps: true
        }
    );
}

export const associateVendorModel = (orm: {
    User: typeof User;
    VendorIndustry: typeof VendorIndustry;
    VendorService: typeof VendorService;
    EventVendor: typeof EventVendor;
}) => {
    Vendor.belongsTo(orm.User, {
        foreignKey: 'user_id',
        as: 'user'
    });

    Vendor.hasOne(orm.VendorIndustry, {
        foreignKey: 'industry_id',
        as: 'industry'
    });

    Vendor.hasMany(orm.VendorService, {
        foreignKey: 'vendor_id',
        as: 'services'
    });

    Vendor.hasMany(orm.EventVendor, {
        foreignKey: 'vendor_id',
        as: 'events'
    });
}