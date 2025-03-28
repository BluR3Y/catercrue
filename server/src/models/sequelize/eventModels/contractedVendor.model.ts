import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    Sequelize,
    BelongsToGetAssociationMixin
} from "sequelize";
import type { Event } from "./event.model";
import type { Coordinator } from "../coordinatorModels/coordinator.model";

export class ContractedVendor extends Model<InferAttributes<ContractedVendor>, InferCreationAttributes<ContractedVendor>> {
    public id!: CreationOptional<string>;
    public event_id!: CreationOptional<string>;
    public coordinator_id!: string;
    public services!: CreationOptional<string[]>;

    // Sequelize created association methods
    public getEvent!: BelongsToGetAssociationMixin<Event>;
    public getCoordinator!: BelongsToGetAssociationMixin<Coordinator>;
}

export const initContractedVendorModel = (sequelize: Sequelize) => {
    ContractedVendor.init(
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
            services: {
                type: DataTypes.ARRAY(DataTypes.STRING)
            }
        },
        {
            tableName: 'contracted_vendors',
            modelName: 'ContractedVendor',
            sequelize,
            timestamps: true
        }
    );
}

export const associateContractedVendorModel = (orm: {
    Event: typeof Event;
    Coordinator: typeof Coordinator;
}) => {
    ContractedVendor.belongsTo(orm.Event, {
        foreignKey: 'event_id',
        as: 'event'
    });
    ContractedVendor.belongsTo(orm.Coordinator, {
        foreignKey: 'coordinator_id',
        as: 'coordinator'
    });
}