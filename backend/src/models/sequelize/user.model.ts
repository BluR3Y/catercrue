import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute } from "sequelize";
import { getSequelizeInstance } from "../../config/postgres";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    public id!: CreationOptional<string>;
    public firstName!: string;
    public lastName!: string;
    public avatarUrl!: CreationOptional<string>;

    public readonly createdAt!: CreationOptional<Date>;
    public readonly updatedAt!: CreationOptional<Date>;

    get fullName(): NonAttribute<string> {
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
                isUrl: true,
                isValidUrl(value: string) {
                    if (value && !/^https?:\/\/.+/.test(value)) {
                        throw new Error("Avatar URL must start with http:// or https://");
                    }
                }
            }
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    },
    {
        tableName: 'users',
        modelName: 'User',
        sequelize: getSequelizeInstance(),
        timestamps: true
    }
);

// Hook triggered before saving (creating/updating)
User.beforeSave((user) => {
    if (user.changed('firstName')) {
        user.firstName = user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1);
    }
    if (user.changed('lastName')) {
        user.lastName = user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1);
    }
});

export default User;