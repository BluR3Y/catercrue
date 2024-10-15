import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../configs/database";
import User from "./user.model";
import { compare, hash } from "bcrypt";
import { randomBytes } from "crypto";

interface RefreshTokenAttributes {
    id: string;
    userId: string;
    token?: string;
    expiry?: Date;
}

interface RefreshTokenCreationAttributes extends Optional<RefreshTokenAttributes, 'id'> {}

class RefreshToken extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes>
    implements RefreshTokenAttributes {
        public id!: string;
        public userId!: string;
        public token!: string;
        
        public readonly expiry!: Date;

        async validateRefreshToken(attempt: string): Promise<boolean> {
            return compare(attempt, this.token);
        }
    }

RefreshToken.init(
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
                model: User,
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        token: {
            type: DataTypes.STRING(128),
            defaultValue: () => randomBytes(64).toString('hex'),    // Generates a 128-character token
            allowNull: false
        },
        expiry: {
            type: DataTypes.DATE,
            defaultValue: function() {
                let expiry = new Date();
                expiry.setSeconds(expiry.getSeconds() + parseInt(process.env.REFRESH_TOKEN_DURATION!));
                return expiry;
            },
            allowNull: false
        }
    },
    {
        tableName: 'refresh_tokens',
        modelName: 'RefreshToken',
        sequelize,
        timestamps: true
    }
);

// Associations
User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' });
RefreshToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Hooks
RefreshToken.beforeSave(async (rt, options) => {
    const saltRounds = 12;
    rt.token = await hash(rt.token, saltRounds);
});

export default RefreshToken;