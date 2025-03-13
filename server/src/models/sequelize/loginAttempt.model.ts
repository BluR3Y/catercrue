import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { getSequelizeInstance } from "../../config/postgres";
import errorData from "../../config/errors.json";
import orm from ".";
import { Op } from "sequelize";

const loginErrors = errorData.login;
const allErrors = [
    ...loginErrors.ACCOUNT,
    ...loginErrors.AUTH,
    ...loginErrors.MFA,
    ...loginErrors.SECURITY
];

class LoginAttempt extends Model<InferAttributes<LoginAttempt>, InferCreationAttributes<LoginAttempt>> {
    public id!: CreationOptional<string>;
    public userId!: string;
    public ipAddress!: string;
    public userAgent!: string;
    public location!: CreationOptional<string>;
    public validation!: boolean;
    public failureReason!: CreationOptional<string>;

    public readonly createdAt!: CreationOptional<Date>;

    // static async prohibitLogin(userId: string): Promise<string | null> {
    //     const latestAttempts = await this.findAll({
    //         where: {
    //             userId
    //         },
    //         limit: 5,
    //         order: [ ['createdAt', 'DESC'] ]
    //     });

    //     if (!latestAttempts) return null;

    //     const firstAttempt = latestAttempts[0];

    //     // These failure reasons immediately prohibit login
    //     const UNCHANGING_REASONS = allErrors.slice(1);

    //     if (UNCHANGING_REASONS.includes(firstAttempt.failureReason!)) {
    //         return firstAttempt.failureReason!;
    //     }

    //     // If all 5 attempts failed due to "INCORRECT_PASSWORD", prohibit login
    //     const incorrectPasswordAttempts = latestAttempts.filter(
    //         (attempt) => attempt.failureReason === "INCORRECT_PASSWORD"
    //     );

    //     if (incorrectPasswordAttempts.length === 5) {
    //         return "TOO_MANY_ATTEMPTS";
    //     }

    //     return null;
    // }
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
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: 'login_attempts',
        modelName: 'LoginAttempt',
        sequelize: getSequelizeInstance(),
        indexes: [
            { fields: ['userId', 'createdAt'] },
            { fields: ['ipAddress'] }
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

LoginAttempt.afterCreate(async (attemptInstance: LoginAttempt) => {
    // Not efficient: Move to redis cache for better performance
    if (!attemptInstance.validation && attemptInstance.failureReason === "INCORRECT_PASSWORD") {
        const lockoutTime = 15 * 60000; // 15 minutes
        const maxFailedAttempts = 5;

        const lastSuccessfulAttempt = await LoginAttempt.findOne({
            where: {
                userId: attemptInstance.userId,
                validation: true,
                createdAt: {
                    [Op.gte]: new Date(Date.now() - lockoutTime)
                }
            },
            order: [['createdAt','DESC']]
        });
        const lastAttemptTime = lastSuccessfulAttempt ? lastSuccessfulAttempt.createdAt : new Date(Date.now() - lockoutTime);

        // Count incorrect password attempts within the last X minutes and after last successful attempt
        const incorrectAttemptsCount = await LoginAttempt.count({
            where: {
                userId: attemptInstance.userId,
                failureReason: "INCORRECT_PASSWORD",
                createdAt: {
                    [Op.gte]: lastAttemptTime
                }
            }
        });

        // Lock account if attempts exceed max limit within the time window
        if (incorrectAttemptsCount >= maxFailedAttempts) {
            await orm.Password.update(
                { isActive: false },
                { where: { userId: attemptInstance.userId, isActive: true } }
            );
        }
    }
});

export default LoginAttempt;