import { DataTypes, Model, Optional } from "sequelize";
import { getSequelizeInstance } from "../../../config/postgres";
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
    }

RefreshToken.init(
    {
        id: {
            type: DataTypes.STRING(255),
            defaultValue: () => crypto.randomBytes(32).toString("hex"),
            allowNull: false,
            primaryKey: true
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
        sequelize: getSequelizeInstance(),
        timestamps: true,
        updatedAt: false
    }
);

export default RefreshToken