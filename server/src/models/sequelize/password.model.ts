import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Optional } from "sequelize";
import { getSequelizeInstance } from "../../config/postgres";
import bcrypt from "bcrypt";

class Password extends Model<InferAttributes<Password>, InferCreationAttributes<Password>> {
    public id!: CreationOptional<string>;   // Auto-generated UUID
    public userId!: string;
    public password!: string;
    public isActive!: CreationOptional<boolean>;

    public readonly createdAt!: CreationOptional<Date>; // Managed by Sequelize

    // Method to hash password
    public async hashPassword(): Promise<void> {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }

    // Method to compare passwords
    public async validatePassword(attempt: string): Promise<boolean> {
        return bcrypt.compare(attempt, this.password);
    }

    // Method to check if password is a recent repeat
    public async isRecentRepeat(): Promise<boolean> {
        const numBeforeReuse = 5;
        const latestPasswords = await Password.findAll({
            where: { userId: this.userId },
            order: [ ['createdAt', 'DESC'] ],
            limit: numBeforeReuse
        })

        for (const record of latestPasswords) {
            if (await bcrypt.compare(this.password, record.password)) {
                return true;
            }
        }
        return false;
    }

    // Method to deactivate previous password
    public static async deactivatePreviousPassword(userId: string) {
        await Password.update({ isActive: false }, { where: { userId, isActive: true } });
    }
}

Password.init(
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
                model: 'users',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        }
    },
    {
        tableName: 'passwords',
        modelName: 'Password',
        sequelize: getSequelizeInstance(),
        indexes: [
            { fields: ['userId'] },
            { unique: true, fields: ["userId", "isActive"], where: { isActive: true } }
        ],
        timestamps: true,
        updatedAt: false
    }
);

// Hook triggered before record is created
Password.beforeCreate(async (passwordInstance: Password) => {
    // Determine if password was already used by user
    if (await passwordInstance.isRecentRepeat()) {
        throw new Error("New password cannot be the same as a previous one");
    }

    // Hash password before creating record
    await passwordInstance.hashPassword();

    // Deactivate previous password
    await Password.deactivatePreviousPassword(passwordInstance.userId);
});

// Hook triggered before record is updated
Password.beforeUpdate(async (passwordInstance: Password) => {
    if (
        passwordInstance.changed('id') ||
        passwordInstance.changed('userId') ||
        passwordInstance.changed('password') ||
        passwordInstance.changed('createdAt')
    ) {
        throw new Error("Can not modify password records");
    }
});

export default Password