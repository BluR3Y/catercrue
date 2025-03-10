import { DataTypes, Model, Optional } from "sequelize";
import { getSequelizeInstance } from "../../config/postgres";

interface UserAttributes {
    id: string;
    firstName: string;
    lastName: string;
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
        public avatarUrl?: string;

        public readonly createdAt!: Date;
        public readonly updatedAt!: Date;

        get fullName(): string {
            return `${this.firstName} ${this.lastName}`;
        }
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
        timestamps: true
    }
);

export default User;