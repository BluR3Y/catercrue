import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import User from "./user.model";

interface CoordinatorAttributes {
    id: string;
    userId: string;
}

interface CoordinatorCreationAttributes extends Optional<CoordinatorAttributes, 'id'> {}

class Coordinator extends Model<CoordinatorAttributes, CoordinatorCreationAttributes> implements CoordinatorAttributes {
    public id!: string;
    public userId!: string;
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
                model: User,
                key: 'id'
            },
            onDelete: 'CASCADE'
        }
    },
    {
        tableName: 'coordinators',
        sequelize
    }
);

export default Coordinator;