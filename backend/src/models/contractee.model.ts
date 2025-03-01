import { DataTypes, Model, Optional } from "sequelize";
import { getSequelizeInstance } from "../config/postgres";

interface ContracteeAttributes {
    id: string;
    userId: string;
    createdAt?: Date;
}

interface ContracteeCreationAttributes extends Optional<ContracteeAttributes, 'id'> {}

class Contractee extends Model<ContracteeAttributes, ContracteeCreationAttributes>
    implements ContracteeAttributes {
        public id!: string;
        public userId!: string;

        public readonly createdAt!: Date;
    }

Contractee.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true
        },
    },
    {
        tableName: 'contractee',
        modelName: 'Contractee',
        sequelize: getSequelizeInstance(),
        timestamps: true,
        updatedAt: false
    }
);

export default Contractee;