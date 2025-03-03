import { DataTypes, Model, Optional } from "sequelize";
import { getSequelizeInstance } from "../../config/postgres";

interface CoordinatorAttributes {
    id: string;
    userId: string;
    createdAt?: Date;
}

interface CoordinatorCreationAttributes extends Optional<CoordinatorAttributes, 'id'> {}

class Coordinator extends Model<CoordinatorAttributes, CoordinatorCreationAttributes>
    implements CoordinatorAttributes {
        public id!: string;
        public userId!: string;

        public readonly createdAt!: Date;
    }

Coordinator.init(
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
            references: {
                model: 'users',
                key: 'id'
            },
            unique: true
        },
    },
    {
        tableName: 'coordinators',
        modelName: 'Coordinator',
        sequelize: getSequelizeInstance(),
        timestamps: true,
        updatedAt: false
    }
);

export default Coordinator;