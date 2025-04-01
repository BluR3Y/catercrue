import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    Sequelize,
    BelongsToGetAssociationMixin
} from "sequelize";
import type { Worker } from "./worker.model";

export class Contractor extends Model<InferAttributes<Contractor>, InferCreationAttributes<Contractor>> {
    public id!: CreationOptional<string>;
    public worker_id!: CreationOptional<string>;
    public home_address!: string;

    public getWorker!: BelongsToGetAssociationMixin<Worker>;
}

export const initContractorModel = (sequelize: Sequelize) => {
    Contractor.init(
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
                }
            },
            home_address: {
                type: DataTypes.GEOMETRY('POINT'),
                allowNull: false
            }
        },
        {
            tableName: 'contractors',
            modelName: 'Contractor',
            sequelize,
            timestamps: true
        }
    );
}

export const associateContractorModel = (orm: {
    Worker: typeof Worker;
}) => {
    Contractor.belongsTo(orm.Worker, {
        foreignKey: 'worker_id',
        as: 'worker'
    });
}