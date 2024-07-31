import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import User from "./user.model";
import Address from "./address.model";

interface StaffAttributes {
    id: string;
    userId: string;
    addressId: string;
    resumeUrl: string;
    bio: string;
}

// Define attributes that are optional for model creation
interface StaffCreationAttributes extends Optional<StaffAttributes, 'id'> {}

// Define the Staff model
class Staff extends Model<StaffAttributes, StaffCreationAttributes> implements StaffAttributes {
    public id!: string;
    public userId!: string;
    public addressId!: string;
    public resumeUrl!: string;
    public bio!: string;
}

Staff.init(
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
        },
        addressId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Address,
                key: 'id'
            }
        },
        resumeUrl: {
            type: DataTypes.STRING(128),
            allowNull: true,
            validate: {
                isUrl: true
            }
        },
        bio: {
            type: DataTypes.TEXT,
            allowNull: true,
        }
    },
    {
        tableName: 'staff',
        sequelize
    }
);

export default Staff;