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
import type { Worker } from "../workerModels/worker.model";
import type { IndustryRole } from "../workerModels/industryRole.model";

export class Employee extends Model<InferAttributes<Employee>, InferCreationAttributes<Employee>> {
    public id!: CreationOptional<string>;
    public vendor_id!: CreationOptional<string>;
    public worker_id!: CreationOptional<string>;
    public role_id!: number;

    // Sequelize defined association methods
    public getVendor!: BelongsToGetAssociationMixin<Vendor>;
    public getWorker!: BelongsToGetAssociationMixin<Worker>;
    public getRole!: HasOneGetAssociationMixin<IndustryRole>;
}

export const initEmployeeModel = (sequelize: Sequelize) => {
    Employee.init(
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
            worker_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'workers',
                    key: 'id'
                }
            },
            role_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'industry_roles',
                    key: 'id'
                }
            }
        },
        {
            tableName: 'employees',
            modelName: 'Employee',
            sequelize,
            timestamps: true
        }
    );
}

export const associateEmployeeModel = (orm: {
    Vendor: typeof Vendor;
    Worker: typeof Worker;
    IndustryRole: typeof IndustryRole;
}) => {
    Employee.belongsTo(orm.Vendor, {
        foreignKey: 'vendor_id',
        as: 'vendor'
    });
    Employee.belongsTo(orm.Worker, {
        foreignKey: 'worker_id',
        as: 'worker'
    });
    Employee.hasOne(orm.IndustryRole, {
        foreignKey: 'role_id',
        as: 'role'
    });
}