import { DataTypes, Model, Optional } from "sequelize";
import { getSequelizeInstance } from "../config/postgres";
import User from "./user.model";

enum failureReasons {
    'INCORRECT_PASSWORD',
    'PASSWORD_EXPIRED',
    'PASSWORD_NOT_SET',
    'ACCOUNT_LOCKED',
    'ACCOUNT_SUSPENDED',
    'ACCOUNT_BANNED',
    'ACCOUNT_DELETED'
}

interface LoginAttemptAttributes {
    id?: string;
    userId: string;
    ipAddress: string;
    userAgent: string;
    location?: string;
    validation: boolean;
    failureReason?: failureReasons;
    createdAt?: Date;
}

interface LoginAttemptCreationAttributes extends Optional<LoginAttemptAttributes, 'id'> {}

class LoginAttempt extends Model<LoginAttemptAttributes, LoginAttemptCreationAttributes>
    implements LoginAttemptAttributes {
        public id!: string;
        public userId!: string;
        public ipAddress!: string;
        public userAgent!: string;
        public location?: string;
        public validation!: boolean;
        public failureReason?: failureReasons;

        public readonly createdAt!: Date;

        static async prohibitLogin(userId: string): Promise<string | null> {
            const latestAttempts = await this.findAll({
                where: {
                    userId
                },
                limit: 5,
                order: [ ['createdAt', 'DESC'] ]
            });

            if (latestAttempts) {
                for (let i = 0; i < latestAttempts.length; i++) {
                    console.log('latest loop')
                }
            }

            return null;
        }
    }

LoginAttempt.init(
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
        ipAddress: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        userAgent: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        location: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        validation: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        failureReason: {
            type: DataTypes.STRING(128),
            allowNull: true
        }
    },
    {
        tableName: 'login_attempts',
        modelName: 'LoginAttempt',
        sequelize: getSequelizeInstance(),
        indexes: [
            { fields: ['userId'] }
        ],
        timestamps: true,
        updatedAt: false
    }
)

export default LoginAttempt;