import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    Sequelize
} from "sequelize";
import { Worker } from "./worker.model";
// import { WorkerAvailability } from "./workerAvailability.model";

export class WorkerException extends Model<InferAttributes<WorkerException>, InferCreationAttributes<WorkerException>> {
    public id!: CreationOptional<string>;
    public worker_id!: CreationOptional<string>;
    public date!: string;
    public start_time!: string;
    public end_time!: string;
    public is_available!: boolean;
    public reason!: CreationOptional<string>;
}

export const initWorkerExceptionModel = (sequelize: Sequelize) => {
    WorkerException.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            worker_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'workers',
                    key: "id"
                },
                onDelete: "CASCADE"
            },
            date: {
                type: DataTypes.DATEONLY,   // Stores date (YYYY-MM-DD)
                allowNull: false
            },
            start_time: {
                type: DataTypes.TIME,   // Stores time (HH:MM)
                allowNull: false
            },
            end_time: {
                type: DataTypes.TIME,
                allowNull: false
            },
            is_available: {
                type: DataTypes.BOOLEAN,
                allowNull: false
            },
            reason: {
                type: DataTypes.STRING
            }
        },
        {
            tableName: "worker_exceptions",
            modelName: "WorkerException",
            sequelize,
            timestamps: false,
            validate: {
                validateTimes() {
                    const { start_time, end_time } = this as { start_time: string; end_time: string };
                    if (start_time >= end_time) {
                        throw new Error("Start time must be less than end time")
                    }
                }
            }
        }
    );
}

export const associateWorkerExceptionModel = (orm: {
    Worker: typeof Worker
}) => {
    WorkerException.belongsTo(orm.Worker, {
        foreignKey: 'worker_id',
        as: 'worker'
    });
}