import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../configs/database";
import Staff from "./staff.model";
import StaffRole from "./staffRole.model";

interface StaffSeekingRoleAttributes {
    id: string;
    staffId: string;
    roleId: string;
}

interface StaffSeekingRoleCreationAttributes extends Optional<StaffSeekingRoleAttributes, 'id'> {}

class StaffSeekingRole extends Model<StaffSeekingRoleAttributes, StaffSeekingRoleCreationAttributes> implements StaffSeekingRoleAttributes {
    public id!: string;
    public staffId!: string;
    public roleId!: string;
}

StaffSeekingRole.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        staffId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Staff,
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        roleId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: StaffRole,
                key: 'id'
            }
        }
    },
    {
        tableName: 'staff_seeking_roles',
        sequelize
    }
);

export default StaffSeekingRole;