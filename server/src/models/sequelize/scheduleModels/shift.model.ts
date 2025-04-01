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
import type { Event } from "../eventModels/event.model";
import type { Coordinator } from "../vendorModels/coordinator.model";
import type { Worker } from "../workerModels/worker.model";
import type { IndustryRole } from "../workerModels/industryRole.model";

export class Shift extends Model<InferAttributes<Shift>, InferCreationAttributes<Shift>> {
    public id!: CreationOptional<string>;
    public event_id!: CreationOptional<string>;
    public coordinator_id!: CreationOptional<string>;
    public worker_id!: string;
    public role_id!: number;
    public shift_start!: Date;
    public shift_end!: Date;

    // Sequelize defined association method
    public getEvent!: BelongsToGetAssociationMixin<Event>;
    public getCoordinator!: BelongsToGetAssociationMixin<Coordinator>;
    public getWorker!: BelongsToGetAssociationMixin<Worker>;
    public getRole!: HasOneGetAssociationMixin<IndustryRole>;
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
            coordinator_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'coordinators',
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
            timestamps: true
        }
    );
}

export const associateShiftModel = (orm: {
    Event: typeof Event;
    Coordinator: typeof Coordinator;
    Worker: typeof Worker;
    IndustryRole: typeof IndustryRole;
}) => {
    Shift.belongsTo(orm.Event, {
        foreignKey: 'event_id',
        as: 'event'
    });
    Shift.belongsTo(orm.Coordinator, {
        foreignKey: 'coordinator_id',
        as: 'coordinator'
    });
    Shift.belongsTo(orm.Worker, {
        foreignKey: 'worker_id',
        as: 'worker'
    });
    Shift.hasOne(orm.IndustryRole, {
        foreignKey: 'role_id',
        as: 'role'
    });
}