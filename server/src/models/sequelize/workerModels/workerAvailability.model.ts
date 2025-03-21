import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    Sequelize,
    Op
} from "sequelize";
import { WeekDay } from "@/types/models";
import { Worker } from "./worker.model";

export class WorkerAvailability extends Model<InferAttributes<WorkerAvailability>, InferCreationAttributes<WorkerAvailability>> {
    public id!: CreationOptional<string>;
    public worker_id!: string;
    public week_day!: WeekDay;
    public start_time!: string;
    public end_time!: string;
}

export const initWorkerAvailabilityModel = (sequelize: Sequelize) => {
    WorkerAvailability.init(
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
                    key: 'id'
                },
                onDelete: "CASCADE"
            },
            week_day: {
                type: DataTypes.ENUM(...Object.values(WeekDay)),
                allowNull: false
            },
            start_time: {
                type: DataTypes.TIME,   // Stores HH:MM format
                allowNull: false
            },
            end_time: {
                type: DataTypes.TIME,
                allowNull: false
            }
        },
        {
            tableName: "worker_availability",
            modelName: "WorkerAvailability",
            sequelize,
            timestamps: false,
            indexes: [
                {
                    unique: true,
                    fields: ['worker_id', 'week_day', 'start_time']
                }
            ],
            validate: {
                validateTime() {
                    const { start_time, end_time } = this as { start_time: string; end_time: string };
                    if (start_time >= end_time) {
                        throw new Error('Start time must be less than end time');
                    }
                }
            }
        }
    );
    
    WorkerAvailability.beforeSave(async function(instance) {
        // Find all overlapping availabilities for the same worker & weekday
        const overlapping = await WorkerAvailability.findAll({
            where: {
                worker_id: instance.worker_id,
                week_day: instance.week_day,
                [Op.or]: [
                    // Might need modifying
                    { start_time: { [Op.lte]: instance.end_time }, end_time: { [Op.gte]: instance.start_time } },
                    { start_time: { [Op.between]: [instance.start_time, instance.end_time] } },
                    { end_time: { [Op.between]: [instance.start_time, instance.end_time] } }
                ]
            }
        });
    
        if (overlapping.length > 0) {
            // Expand new instance to encompass all overlaps
            instance.start_time = overlapping.reduce(
                (earliest, curr) => (curr.start_time < earliest ? curr.start_time : earliest),
                instance.start_time
            );
            instance.end_time = overlapping.reduce(
                (latest, curr) => (curr.end_time > latest ? curr.end_time : latest),
                instance.end_time
            );
    
            // Remove old conflicting records
            await WorkerAvailability.destroy({
                where: {
                    worker_id: instance.worker_id,
                    week_day: instance.week_day,
                    id: { [Op.in]: overlapping.map(a => a.id) }
                }
            });
        }
    });
}

export const associateWorkerAvailabilityModel = (orm: {
    Worker: typeof Worker
}) => {
    WorkerAvailability.belongsTo(orm.Worker, {
        foreignKey: 'worker_id',
        as: 'worker'
    });
}