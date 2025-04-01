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
    HasManyCountAssociationsMixin
} from "sequelize";

import type { Coordinator } from "./coordinator.model";
import type { VendorService } from "./vendorService.model";
import type { Employee } from "./employee.model";

export class Vendor extends Model<InferAttributes<Vendor>, InferCreationAttributes<Vendor>> {
    public id!: CreationOptional<string>;
    public coordinator_id!: CreationOptional<string>;
    public business_name!: string;
    public description!: CreationOptional<string>;
    public business_address!: string;
    public business_phone!: CreationOptional<string>;
    public business_email!: CreationOptional<string>;
    public business_website!: CreationOptional<string>;

    // Sequelize defined association methods
    public getCoordinator!: BelongsToGetAssociationMixin<Coordinator>;

    public getServices!: HasManyGetAssociationsMixin<VendorService>;
    public createService!: HasManyCreateAssociationMixin<VendorService>;

    public getEmployees!: HasManyGetAssociationsMixin<Employee>;
    public countEmployees!: HasManyCountAssociationsMixin;
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
            coordinator_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'coordinators',
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
    Coordinator: typeof Coordinator;
    VendorService: typeof VendorService;
    Employee: typeof Employee;
}) => {
    Vendor.belongsTo(orm.Coordinator, {
        foreignKey: 'coordinator_id',
        as: 'coordinator'
    });
    Vendor.hasMany(orm.VendorService, {
        foreignKey: 'vendor_id',
        as: 'services'
    });
    // Vendor.hasMany(orm.Employee, {
    //     foreignKey: 'vendor_id',
    //     as: 'employees'
    // });
}