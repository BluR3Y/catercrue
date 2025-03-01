import { DataTypes, Model, Optional } from "sequelize";
import { getSequelizeInstance } from "../config/postgres";
import crypto from "crypto";
import User from "./user.model";

interface RefreshTokenAttributes {
    id: string;
    userId: string;
    expiry?: Date;
}

interface RefreshTokenCreationAttributes extends Optional<RefreshTokenAttributes, 'id'> {}

class RefreshToken extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes>
    implements RefreshTokenAttributes {
        public id!: string;
        public userId!: string;
        public readonly expiry!: Date;

        public isExpired(): boolean {
            return new Date() > this.expiry;
        }
    }

RefreshToken.init(
    {
        id: {
            type: DataTypes.STRING(255),
            defaultValue: () => crypto.randomBytes(32).toString("hex"),
            primaryKey: true,
            allowNull: false,
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
        expiry: {
            type: DataTypes.DATE,
            defaultValue: function() {
                const duration = Number(process.env.REFRESH_TOKEN_DURATION) || 604800;  // Default 7 days
                return new Date(Date.now() + duration * 1000);
            },
            allowNull: false
        }
    },
    {
        tableName: 'refresh_tokens',
        modelName: 'RefreshToken',
        sequelize: getSequelizeInstance(),
        timestamps: true,
        updatedAt: false
    }
);

// Prevent expiry updates
RefreshToken.beforeUpdate(() => {
    throw new Error("Record cannot be updated.");
});

export default RefreshToken