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
    HasOneGetAssociationMixin,
    HasOneCreateAssociationMixin
} from "sequelize";
import type { User } from "../userModels/user.model";
import type { Vendor } from "../vendorModels/vendor.model";
import type { Event } from "../eventModels/event.model";
import type { ContractedVendor } from "../eventModels/contractedVendor.model";

export class Coordinator extends Model<InferAttributes<Coordinator>, InferCreationAttributes<Coordinator>> {
    public id!: CreationOptional<string>;
    public user_id!: CreationOptional<string>;

    // Sequelize defined association methods
    public getUser!: BelongsToGetAssociationMixin<User>;

    public getVendor!: HasOneGetAssociationMixin<Vendor>;
    public createVendor!: HasOneCreateAssociationMixin<Vendor>;

    public getEvents!: HasManyGetAssociationsMixin<Event>;

    public getContractedEvents!: HasManyGetAssociationsMixin<ContractedVendor>;
}

export const initCoordinatorModel = (sequelize: Sequelize) => {
    Coordinator.init(
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
                references: {
                    model: 'users',
                    key: 'id'
                }
            }
        },
        {
            tableName: 'coordinators',
            modelName: 'Coordinator',
            sequelize,
            timestamps: true
        }
    );
}

export const associateCoordinatorModel = (orm: {
    User: typeof User;
    Vendor: typeof Vendor;
    Event: typeof Event;
    ContractedVendor: typeof ContractedVendor;
}) => {
    Coordinator.belongsTo(orm.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
    Coordinator.hasOne(orm.Vendor, {
        foreignKey: 'coordinator_id',
        as: 'vendor'
    });
    Coordinator.hasMany(orm.Event, {
        foreignKey: 'coordinator_id',
        as: 'events'
    });
    Coordinator.hasMany(orm.ContractedVendor, {
        foreignKey: 'coordinator_id',
        as: 'contractedEvents'
    });
}