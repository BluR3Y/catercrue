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
import type { Worker } from "../workerModels/worker.model";
import type { IndustryRole } from "../workerModels/industryRole.model";

export class Job extends Model<InferAttributes<Job>, InferCreationAttributes<Job>> {
    public id!: CreationOptional<string>;
    public event_id!: CreationOptional<string>;
    public worker_id!: string;
    public role_id!: string;
    public due_date!: Date;

    // Sequelize defined association methods
    public getEvent!: BelongsToGetAssociationMixin<Event>;

    public getWorker!: BelongsToGetAssociationMixin<Worker>;

    public getRole!: HasOneGetAssociationMixin<IndustryRole>;
}

export const initJobModel = (sequelize: Sequelize) => {
    Job.init(
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
            },
            due_date: {
                type: DataTypes.DATE,
                allowNull: false
            }
        },
        {
            tableName: 'jobs',
            modelName: 'Job',
            sequelize,
            timestamps: true
        }
    );
}
// Last Here
export const associateJobModel = (orm: {
    Event: typeof Event;
    Worker: typeof Worker;
    IndustryRole: typeof IndustryRole;
}) => {
    Job.belongsTo(orm.Event, {
        foreignKey: 'event_id',
        as: 'event'
    });
    Job.belongsTo(orm.Worker, {
        foreignKey: 'worker_id',
        as: 'worker'
    });
    Job.hasOne(orm.IndustryRole, {
        foreignKey: 'role_id',
        as: 'role'
    });
    // To vendor?
}