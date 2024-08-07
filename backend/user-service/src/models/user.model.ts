import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import { compare, hash } from "bcrypt";

// https://sequelize.org/docs/v6/core-concepts/validations-and-constraints/

interface UserAttributes {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    password: string;
    avatarUrl?: string;
    dateRegisterd?: Date;
    dateUpdated?: Date;
}

// Define attributes that are optional for model creation
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

// Define the User model
class User extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes {
        public id!: string;
        public name!: string;
        public email!: string;
        public phone!: string;
        public password!: string;
        public avatarUrl!: string;

        // Timestamps
        public readonly dateRegisterd!: Date;
        public readonly dateUpdated!: Date;

        static async hashPassword(password: string): Promise<string> {
            const saltRounds = 12;
            return hash(password, saltRounds);
        }

        async validatePassword(attempt: string): Promise<boolean> {
            return compare(attempt, this.password);
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
        name: {
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
            allowNull: true,
            unique: true,
            validate: {
                is: {
                    args: /^\+?[1-9]\d{1,14}$/,
                    msg: 'Invalid phone number'
                }
            }
        },
        password: {
            type: new DataTypes.STRING(128),
            allowNull: false
        },
        avatarUrl: {
            type: new DataTypes.STRING(128),
            allowNull: true,
            validate: {
                isUrl: true
            }
        }
    },
    {
        tableName: 'users',
        modelName: 'User',
        sequelize,
        validate: {
            eitherEmailOrPhone() {
                if (!this.email && !this.phone) {
                    throw new Error('At least one of email or phone must be provided');
                }
            }
        }
    }
);

export default User;