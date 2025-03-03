import { DataTypes, Model, Optional } from "sequelize";
import { getSequelizeInstance } from "../../config/postgres";
import User from "./user.model";
import errorData from "../../config/errors.json";

const loginErrors = errorData.login;
const allErrors = [
    ...loginErrors.ACCOUNT,
    ...loginErrors.AUTH,
    ...loginErrors.MFA,
    ...loginErrors.SECURITY
];

interface LoginAttemptAttributes {
    id?: string;
    userId: string;
    ipAddress: string;
    userAgent: string;
    location?: string;
    validation: boolean;
    failureReason?: string | null;
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
        public failureReason?: string;

        public readonly createdAt!: Date;

        static async prohibitLogin(userId: string): Promise<string | null> {
            const latestAttempts = await this.findAll({
                where: {
                    userId
                },
                limit: 5,
                order: [ ['createdAt', 'DESC'] ]
            });

            if (!latestAttempts) return null;

            const firstAttempt = latestAttempts[0];

            // These failure reasons immediately prohibit login
            const UNCHANGING_REASONS = allErrors.slice(1);

            if (UNCHANGING_REASONS.includes(firstAttempt.failureReason!)) {
                return firstAttempt.failureReason!;
            }

            // If all 5 attempts failed due to "INCORRECT_PASSWORD", prohibit login
            const incorrectPasswordAttempts = latestAttempts.filter(
                (attempt) => attempt.failureReason === "INCORRECT_PASSWORD"
            );

            if (incorrectPasswordAttempts.length === 5) {
                return "TOO_MANY_ATTEMPTS";
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
            type: DataTypes.STRING(45),
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
            type: DataTypes.STRING(50),
            allowNull: true,
            validate: {
                isIn: [allErrors],
            }
        }
    },
    {
        tableName: 'login_attempts',
        modelName: 'LoginAttempt',
        sequelize: getSequelizeInstance(),
        indexes: [
            { fields: ['userId'] },
            { fields: ['ipAddress'] },
            { fields: ['createdAt'] }
        ],
        timestamps: true,
        updatedAt: false
    }
)

LoginAttempt.beforeValidate(async (attemptInstance: LoginAttempt) => {
    if (!attemptInstance.validation && !attemptInstance.failureReason) {
        throw new Error("Failure reason must be provided when validation is false");
    }
    if (attemptInstance.validation && attemptInstance.failureReason) {
        throw new Error("Failure reason should not be provided when validation is true")
    }
});

export default LoginAttempt;