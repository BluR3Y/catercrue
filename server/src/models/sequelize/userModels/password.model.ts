import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Optional, Sequelize } from "sequelize";
import bcrypt from "bcrypt";

import type { User } from "./user.model";

export class Password extends Model<InferAttributes<Password>, InferCreationAttributes<Password>> {
    public id!: CreationOptional<string>;   // Auto-generated UUID
    public user_id!: CreationOptional<string>;
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
            where: { user_id: this.user_id },
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
    public static async deactivatePreviousPassword(user_id: string) {
        await Password.update({ isActive: false }, { where: { user_id, isActive: true } });
    }
}

export const initPasswordModel = (sequelize: Sequelize) => {
    Password.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            user_id: {
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
            sequelize,
            indexes: [
                { fields: ['user_id'] },
                { unique: true, fields: ["user_id", "isActive"], where: { isActive: true } }
            ],
            timestamps: true,
            updatedAt: false
        }
    );
    
    // Hook triggered before record is created
    Password.beforeCreate(async (instance: Password) => {
        // Determine if password was already used by user
        if (await instance.isRecentRepeat()) {
            throw new Error("New password cannot be the same as a previous one");
        }
    
        // Hash password before creating record
        await instance.hashPassword();
    
        // Deactivate previous password
        await Password.deactivatePreviousPassword(instance.user_id);
    });
    
    // Hook triggered before record is updated
    Password.beforeUpdate(async (instance: Password) => {
        if (
            instance.changed('id') ||
            instance.changed('user_id') ||
            instance.changed('password') ||
            instance.changed('createdAt')
        ) {
            throw new Error("Can not modify password records");
        }
    });
}

export const associatePasswordModel = (orm : {
    User: typeof User
}) => {
    Password.belongsTo(orm.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
}