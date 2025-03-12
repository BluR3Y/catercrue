import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Optional } from "sequelize";
import { getSequelizeInstance } from "../../config/postgres";
import crypto from "crypto";

class Password extends Model<InferAttributes<Password>, InferCreationAttributes<Password>> {
    public id!: CreationOptional<string>;   // Auto-generated UUID
    public userId!: string;
    public salt!: string;
    public hash!: string;
    public isActive!: CreationOptional<boolean>;

    public readonly createdAt!: CreationOptional<Date>; // Managed by Sequelize

    static hashPassword(password: string): Promise<[string, string]> {
        return new Promise((resolve, reject) => {
            // Generate a random salt
            const salt = crypto.randomBytes(16).toString('hex');
            crypto.scrypt(password, salt, 64, (err, hash) => {
                if (err) return reject(err);
                resolve([salt, hash.toString('hex')]);
            })
        });
    }

    async validatePassword(attempt: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            crypto.scrypt(attempt, this.salt, 64, (err, attemptHash) => {
                if (err) return reject(err);
                resolve(this.hash === attemptHash.toString('hex'));
            });
        })
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
        salt: {
            type: new DataTypes.STRING(32), // Each byte is represented by 2 hex characters
            allowNull: false
        },
        hash: {
            type: new DataTypes.STRING(128),
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
    // Deactive existing active password
    await Password.update({ isActive: false }, {
        where: { userId: passwordInstance.userId, isActive: true }
    });
});

// Hook triggered before record is updated
Password.beforeUpdate(async (passwordInstance: Password) => {
    if (
        passwordInstance.changed('id') ||
        passwordInstance.changed('userId') ||
        passwordInstance.changed('salt') ||
        passwordInstance.changed('hash') ||
        passwordInstance.changed('createdAt')
    ) {
        throw new Error("Can not modify password records");
    }
});

export default Password