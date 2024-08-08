import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import User from "./user.model";

interface StaffAttributes {
    id: string;
    userId: string;
    location: any;
    address?: string;
    resumeUrl: string;
    bio: string;
}

// Define attributes that are optional for model creation
interface StaffCreationAttributes extends Optional<StaffAttributes, 'id'> {}

// Define the Staff model
class Staff extends Model<StaffAttributes, StaffCreationAttributes> implements StaffAttributes {
    public id!: string;
    public userId!: string;
    public location!: any;
    public address?: string;
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
        location: {
            type: DataTypes.GEOMETRY('POINT', 4326),
            allowNull: false
        },
        address: {
            type: new DataTypes.STRING(255),
            allowNull: true
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
        modelName: 'Staff',
        sequelize
    }
);

export default Staff;