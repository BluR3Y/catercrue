import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    Sequelize,
    BelongsToGetAssociationMixin,
    HasOneGetAssociationMixin
} from "sequelize";

export class PendingEmployee extends Model<InferAttributes<PendingEmployee>, InferCreationAttributes<PendingEmployee>> {
    public id!: CreationOptional<string>;
    public vendor_id!: CreationOptional<string>;
    
}