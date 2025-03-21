import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, Sequelize } from "sequelize";
import { EventState } from "@/types/models";

export class Event extends Model<InferAttributes<Event>, InferCreationAttributes<Event>> {
    public id!: CreationOptional<string>;
    public client_id!: CreationOptional<string>;
    public type_id!: string;
    public state!: EventState;
    public status!: string;
    public location!: string;
    public start!: Date;
    public end!: Date;
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
                    return (currentDate < end ? "ongoing" : "completed");
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
                    const currDate = new Date();
                    if (currDate > start || end > start) {
                        throw new Error("Invalid scheduling");
                    }
                }
            }
        }
    );
}

export const associateEventModel = (orm: {

}) => {
    
}