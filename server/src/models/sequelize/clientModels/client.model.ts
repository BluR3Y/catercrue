import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    Sequelize,
    BelongsToGetAssociationMixin,
    HasManyGetAssociationsMixin,
    HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin
} from "sequelize";
import type { User } from "../userModels/user.model";
import type { Event } from "../eventModels/event.model";

export class Client extends Model<InferAttributes<Client>, InferCreationAttributes<Client>> {
    public id!: CreationOptional<string>;
    public user_id!: CreationOptional<string>;

    // Sequelize defined association methods
    public getUser!: BelongsToGetAssociationMixin<User>;

    public getEvents!: HasManyGetAssociationsMixin<Event>;
    public countEvents!: HasManyCountAssociationsMixin;
    public createEvent!: HasManyCreateAssociationMixin<Event>;
}

export const initClientModel = (sequelize: Sequelize) => {
    Client.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
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
            tableName: 'clients',
            modelName: 'Client',
            sequelize,
            timestamps: true
        }
    )
}

export const associateClientModel = (orm: {
    User: typeof User;
    Event: typeof Event;
}) => {
    Client.belongsTo(orm.User, {
        foreignKey: 'user_id',
        as: 'user'
    });

    Client.hasMany(orm.Event, {
        foreignKey: 'client_id',
        as: 'events'
    });
}