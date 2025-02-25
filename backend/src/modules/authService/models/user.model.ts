import { DataTypes, Model, Optional } from "sequelize";
import { getSequelizeInstance } from "../../../config/postgres";

interface UserAttributes {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
    avatarUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Define attributes that are optional for model creation
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

// Define the User model
class User extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes {
        public id!: string;
        public firstName!: string;
        public lastName!: string;
        public email?: string;
        public phone!: string;
        public avatarUrl?: string;

        public readonly createdAt!: Date;
        public readonly updatedAt!: Date;
    }

// Initialize the User model
User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        
        firstName: {
            type: new DataTypes.STRING(128),
            allowNull: false
        },
        lastName: {
            type: new DataTypes.STRING(128),
            allowNull: false
        },
        email: {
            type: new DataTypes.STRING(128),
            allowNull: true,
            unique: true,
            validate: {
                isEmail: true,
                isLowercase: true
            }
        },
        phone: {
            type: new DataTypes.STRING(128),
            allowNull: false,
            unique: true,
            validate: {
                is: {
                    args: /^\+?[1-9]\d{1,14}$/, // Follows E.164 format
                    msg: 'Invalid phone number format'
                }
            }
        },
        avatarUrl: {
            type: new DataTypes.STRING(255),
            allowNull: true,
            validate: {
                isUrl: true
            }
        }
    },
    {
        tableName: 'users',
        modelName: 'User',
        sequelize: getSequelizeInstance(),
        indexes: [
            { unique: true, fields: ['email'] },
            { unique: true, fields: ['phone'] }
        ],
        timestamps: true
    }
);

// Hook triggered before record is saved (created, updated)
User.beforeSave(async (userInstance) => {
    if (userInstance.changed('email')) {
        userInstance.email = userInstance.email?.toLowerCase().trim();
    }
});

export default User;