import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    Sequelize,
    HasManyGetAssociationsMixin,
    HasManyCreateAssociationMixin
} from "sequelize";
import { EventState } from "@/types/models";
import type { EventVendor } from "./eventVendor.model";
import type { Shift } from "../scheduleModels/shift.model";
import { IndustryRole } from "../workerModels/industryRole.model";
import { VendorIndustry } from "../vendorModels/vendorIndustry.model";

export class Event extends Model<InferAttributes<Event>, InferCreationAttributes<Event>> {
    public id!: CreationOptional<string>;
    public client_id!: CreationOptional<string>;
    public type_id!: number;
    public state!: EventState;
    public status!: CreationOptional<string>;
    public location!: string;
    public start!: Date;
    public end!: Date;

    public async getManager() {
        const eventManager = await this.getShifts({include: [
            {
                model: IndustryRole,
                as: 'role',
                where: { name: 'Event Manager' }
            }
        ] });
        if (eventManager.length) {
            return eventManager[0];
        }
        
        if (this.client_id) {
            // return (await this.get)
        }

        // Last Here
    }

    // Sequelize defined association methods
    public getVendors!: HasManyGetAssociationsMixin<EventVendor>;
    public createVendor!: HasManyCreateAssociationMixin<EventVendor>;

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
            client_id: {
                type: DataTypes.UUID,
                // references: {
                //     model: 'clients',
                //     key: 'id'
                // }
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
    );
}

export const associateEventModel = (orm: {
    EventVendor: typeof EventVendor;
    Shift: typeof Shift;
}) => {
    // Client Association
    
    Event.hasMany(orm.EventVendor, {
        foreignKey: 'event_id',
        as: 'vendors'
    });

    Event.hasMany(orm.Shift, {
        foreignKey: 'event_id',
        as: 'shifts'
    });
}