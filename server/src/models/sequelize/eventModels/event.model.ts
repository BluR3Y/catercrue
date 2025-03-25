import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    Sequelize,
    HasManyGetAssociationsMixin,
    HasManyCreateAssociationMixin,
    BelongsToGetAssociationMixin
} from "sequelize";
import { EventState, Manager, roleMap } from "@/types";
import { Client } from "../clientModels/client.model";
import type { EventVendor } from "./eventVendor.model";
import type { Shift } from "../scheduleModels/shift.model";
import { Vendor } from "../vendorModels/vendor.model";
import { Worker } from "../workerModels/worker.model";

export class Event extends Model<InferAttributes<Event>, InferCreationAttributes<Event>> {
    public id!: CreationOptional<string>;
    public client_id!: CreationOptional<string>;
    public manager_id!: CreationOptional<string>;
    public manager_type!: CreationOptional<Manager>;
    public type_id!: number;
    public state!: EventState;
    public status!: CreationOptional<string>;
    public location!: string;
    public start!: Date;
    public end!: Date;

    // Sequelize defined association methods
    public getClient!: BelongsToGetAssociationMixin<Client>;

    public getVendors!: HasManyGetAssociationsMixin<EventVendor>;
    public createVendor!: HasManyCreateAssociationMixin<EventVendor>;

    public getShifts!: HasManyGetAssociationsMixin<Shift>;
    public createShift!: HasManyCreateAssociationMixin<Shift>;

    public async getManager(): Promise<Client | Worker | Vendor | null> {
        const { manager_type, manager_id } = this;
        return await roleMap[manager_type].findByPk(manager_id);
    }
}

export const initEventModel = (sequelize: Sequelize) => {
    Event.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            type_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'event_types',
                    key: 'id'
                }
            },
            client_id: {
                type: DataTypes.UUID,
                references: {
                    model: 'clients',
                    key: 'id'
                }
            },
            manager_id: {
                type: DataTypes.UUID,
                allowNull: false
            },
            manager_type: {
                type: DataTypes.ENUM(...Object.values(Manager)),
                allowNull: false
            },
            state: {
                type: DataTypes.ENUM(...Object.values(EventState)),
                allowNull: false
            },
            status: {
                type: DataTypes.VIRTUAL,
                get() {
                    const { start, end, state } = this;
                    const currentDate = new Date();
                    if (state !== "scheduled" || currentDate < start) return state;
                    return currentDate < end ? "ongoing" : "completed";
                },
                set(value) {
                    throw new Error('Attempted to update virtual property');
                }
            },
            location: {
                type: DataTypes.GEOMETRY('POINT'),
                allowNull: false
            },
            start: {
                type: DataTypes.DATE,
                allowNull: false
            },
            end: {
                type: DataTypes.DATE,
                allowNull: false
            }
        },
        {
            tableName: 'events',
            modelName: 'Event',
            sequelize,
            timestamps: true,
            validate: {
                validateTime() {
                    const { start, end } = this as { start: Date; end: Date };
                    if (start < new Date() || start >= end) {
                        throw new Error("Invalid scheduling");
                    }
                },
                async validateManager() {
                    const { getManager } = this as { getManager: () => Promise<any> }
                    if (!await getManager()) {
                        throw new Error("Manager does not exist")
                    }
                }
            }
        }
    );
}

export const associateEventModel = (orm: {
    EventVendor: typeof EventVendor;
    Shift: typeof Shift;
    Client: typeof Client;
}) => {
    Event.belongsTo(orm.Client, {
        foreignKey: 'client_id',
        as: 'client'
    });

    Event.hasMany(orm.EventVendor, {
        foreignKey: 'event_id',
        as: 'vendors'
    });

    Event.hasMany(orm.Shift, {
        foreignKey: 'event_id',
        as: 'shifts'
    });
}