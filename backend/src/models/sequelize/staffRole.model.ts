import { DataTypes, Model, Optional } from "sequelize";
import { getSequelizeInstance } from "../../config/postgres";

interface StaffRoleAttributes {
    id: string;
    name: string;
}

interface StaffRoleCreationAttributes extends Optional<StaffRoleAttributes, 'id'> {}

class StaffRole extends Model<StaffRoleAttributes, StaffRoleCreationAttributes>
    implements StaffRoleAttributes {
        public id!: string;
        public name!: string;
    }

StaffRole.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(64),
            allowNull: false
        }
    },
    {
        tableName: 'staff_roles',
        modelName: 'StaffRole',
        sequelize: getSequelizeInstance(),
        timestamps: false
    }
);

export default StaffRole;