import { EventState } from "@/types";
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

import type { EventType } from "./eventType.model";
import type { Coordinator } from "../vendorModels/coordinator.model";
import type { ContractedVendor } from "./contractedVendor.model";
import type { Shift } from "../scheduleModels/shift.model";

export class Event extends Model<InferAttributes<Event>, InferCreationAttributes<Event>> {
    public id!: CreationOptional<string>;
    public coordinator_id!: CreationOptional<string>;
    public type_id!: number;
    public state!: EventState;
    public status!: CreationOptional<string>;
    public location!: string;
    public start!: Date;
    public end!: Date;

    // Sequelize defined association methods
    public getType!: HasOneGetAssociationMixin<EventType>;

    public getCoordinator!: BelongsToGetAssociationMixin<Coordinator>;

    public getVendors!: HasManyGetAssociationsMixin<ContractedVendor>;
    public createVendor!: HasManyCreateAssociationMixin<ContractedVendor>;

    public getShifts!: HasManyGetAssociationsMixin<Shift>;
    public createShift!: HasManyCreateAssociationMixin<Shift>;
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
            coordinator_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'coordinators',
                    key: 'id'
                }
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
                }
            }
        }
    )
}

export const associateEventModel = (orm: {
    EventType: typeof EventType;
    Coordinator: typeof Coordinator;
    ContractedVendor: typeof ContractedVendor;
    Shift: typeof Shift;
}) => {
    Event.belongsTo(orm.Coordinator, {
        foreignKey: 'coordinator_id',
        as: 'coordinator'
    });
    Event.hasOne(orm.EventType, {
        foreignKey: 'type_id',
        as: 'type'
    });
    Event.hasMany(orm.ContractedVendor, {
        foreignKey: 'event_id',
        as: 'vendors'
    });
    Event.hasMany(orm.Shift, {
        foreignKey: 'event_id',
        as: 'shifts'
    });
}