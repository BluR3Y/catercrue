import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../configs/database";

interface StaffRoleAttributes {
    id: string;
    name: string;
    description: string;
}

interface StaffRoleCreationAttributes extends Optional<StaffRoleAttributes, 'id'> {}

class StaffRole extends Model<StaffRoleAttributes, StaffRoleCreationAttributes>
    implements StaffRoleAttributes {
        public id!: string;
        public name!: string;
        public description!: string;
    }

StaffRole.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: new DataTypes.STRING(64),
            allowNull: false,
            unique: true,
            validate: {
                isAlpha: true
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        tableName: 'staff_roles',
        sequelize
    }
);

export default StaffRole;