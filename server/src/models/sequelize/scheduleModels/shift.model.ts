import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    Sequelize,
    BelongsToGetAssociationMixin
} from "sequelize";
import type { Event } from "../eventModels/event.model";
import type { IndustryRole } from "../workerModels/industryRole.model";

// import { Client } from "./clientModels/client.model";
import { Vendor } from "../vendorModels/vendor.model";

enum shift_assigners {
    client = "client",
    vendor = "vendor"
}

export class Shift extends Model<InferAttributes<Shift>, InferCreationAttributes<Shift>> {
    public id!: CreationOptional<string>;
    public event_id!: CreationOptional<string>;
    public assigner_type!: shift_assigners;
    public assigner_id!: string;
    public worker_id!: string;
    public role_id!: number;
    public shift_start!: Date;
    public shift_end!: Date;

    public getEvent!: BelongsToGetAssociationMixin<Event>;
}

export const initShiftModel = (sequelize: Sequelize) => {
    Shift.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true
            },
            event_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'events',
                    key: 'id'
                }
            },
            assigner_type: {
                type: DataTypes.ENUM(...Object.values(shift_assigners)),
                allowNull: false
            },
            assigner_id: {
                type: DataTypes.UUID,
                allowNull: false
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
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'industry_roles',
                    key: 'id'
                }
            },
            shift_start: {
                type: DataTypes.DATE,
                allowNull: false
            },
            shift_end: {
                type: DataTypes.DATE,
                allowNull: false
            }
        },
        {
            tableName: 'shifts',
            modelName: 'Shift',
            sequelize,
            timestamps: true,
            // validate: {
            //     async validateAssigner() {
            //         const { assigner_type, assigner_id } = this as { assigner_type: shift_assigners; assigner_id: string };
            //         const assignerModel = assigner_type === 'client' ? Vendor : Vendor;
            //         const assignerExists = await assignerModel.count({
            //             where: { id: assigner_id }
            //         });
            //         if (!assignerExists) {
            //             throw new Error('Assigner does not exist');
            //         }
            //     }
            // }
        }
    );
}

export const associateShiftModel = (orm: {
    Event: typeof Event;
    IndustryRole: typeof IndustryRole;
}) => {
    Shift.belongsTo(orm.Event, {
        foreignKey: 'event_id',
        as: 'event'
    });
    Shift.hasOne(orm.IndustryRole, {
        foreignKey: 'role_id',
        as: 'role'
    });
}