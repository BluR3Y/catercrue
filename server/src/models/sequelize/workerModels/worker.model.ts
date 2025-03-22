import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute, Sequelize, BelongsToGetAssociationMixin, HasManyGetAssociationsMixin, HasManyCreateAssociationMixin } from "sequelize";
import { WeekDay } from "@/types/models";
import { Op } from "sequelize";
import { addMinutesToDate, parseMinutes } from "@/utils/manageTime";

import { User } from "../userModels/user.model";
import { WorkerAvailability } from "./workerAvailability.model";
import { WorkerException } from "./workerException.model";

// Define time slot structure
export interface ITimeSlot {
    start_hours: number;
    start_minutes: number;
    end_hours: number;
    end_minutes: number;
}

export class Worker extends Model<InferAttributes<Worker>, InferCreationAttributes<Worker>> {
    public id!: CreationOptional<string>;
    public user_id!: CreationOptional<string>;
    public home_address!: string;

    public async isWorkerAvailable(start: Date, end: Date): Promise<boolean> {
        const [startDate, startTime] = start.toISOString().split('T');    // Extract YYYY-MM-DD
        const [endDate, endTime] = end.toISOString().split('T');

        // Fetch all exceptions in bulk
        const exceptions = await WorkerException.findAll({
            where: {
                worker_id: this.id,
                date: { [Op.between]: [startDate, endDate] }
            }
        });

        const weekDays: Set<string> = new Set();
        weekDays.add(Object.values(WeekDay)[start.getUTCDay()]);
        weekDays.add(Object.values(WeekDay)[end.getUTCDay()]);

        const availabilities = await WorkerAvailability.findAll({
            where: {
                worker_id: this.id,
                week_day: { [Op.in]: [...weekDays] }
            }
        });

        let currDateObj = start;
        while (currDateObj < end) {
            const [currDate, currTime] = currDateObj.toISOString().split('T');
            const currWeekDay = Object.values(WeekDay)[currDateObj.getUTCDay()];

            const currExceptions = exceptions.filter(exc =>
                exc.date === currDate &&
                exc.start_time <= currTime &&
                currTime < exc.end_time
            );
            if (currExceptions.length) {
                const blockingException = currExceptions.find(exc => !exc.is_available);
                if (blockingException) return false;

                const latestException = currExceptions.reduce((prevExc, currExc) => prevExc.end_time > currExc.end_time ? prevExc: currExc);
                currDateObj = addMinutesToDate(currDateObj, parseMinutes(latestException.end_time) - parseMinutes(currTime) + 1);
                continue;
            }

            const currAvailabilities = availabilities.filter(avail =>
                avail.week_day === currWeekDay &&
                avail.start_time <= currTime &&
                currTime < avail.end_time
            );
            if (!currAvailabilities.length) return false;

            const latestAvailability = currAvailabilities.reduce((prevAvail, currAvail) => prevAvail.end_time > currAvail.end_time ? prevAvail : currAvail);
            currDateObj = addMinutesToDate(currDateObj, parseMinutes(latestAvailability.end_time) - parseMinutes(currTime) + 1);
        }

        return true;
    }

    // Sequelize defined association methods
    public getUser!: BelongsToGetAssociationMixin<User>;
    
    public getWorkerAvailabilities!: HasManyGetAssociationsMixin<WorkerAvailability>;
    public createWorkerAvailability!: HasManyCreateAssociationMixin<WorkerAvailability>;

    public getWorkerExceptions!: HasManyGetAssociationsMixin<WorkerException>;
    public createWorkerException!: HasManyCreateAssociationMixin<WorkerException>;
}

export const initWorkerModel = (sequelize: Sequelize) => {
    Worker.init(
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
                unique: true,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            home_address: {
                type: DataTypes.GEOMETRY('POINT'),
                allowNull: false
            }
        },
        {
            tableName: 'workers',
            modelName: 'Worker',
            sequelize,
            timestamps: true,
            indexes: [
                { fields: ["user_id"], using: "BTREE" }
            ]
        }
    );
}

export const associateWorkerModel = (orm: {
    User: typeof User;
    WorkerAvailability: typeof WorkerAvailability;
    WorkerException: typeof WorkerException;
}) => {
    Worker.belongsTo(orm.User, {
        foreignKey: 'user_id',
        as: 'user'
    });

    Worker.hasMany(orm.WorkerAvailability, {
        foreignKey: 'worker_id',
        as: 'workerAvailabilities'
    });
    Worker.hasMany(orm.WorkerException, {
        foreignKey: 'worker_id',
        as: 'workerExceptions'
    })
}