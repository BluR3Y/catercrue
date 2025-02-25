import { DataTypes, Model, Optional } from "sequelize";
import { getSequelizeInstance } from "../../../config/postgres";
import { compare, hash } from "bcrypt";

interface PasswordAttributes {
    id?: string;
    userId: string;
    password: string;
    isActive?: boolean;
    createdAt?: Date;
}

interface PasswordCreationAttributes extends Optional<PasswordAttributes, 'id'> {}

class Password extends Model<PasswordAttributes, PasswordCreationAttributes>
    implements PasswordAttributes {
        public id!: string;
        public userId!: string;
        public password!: string;
        public isActive!: boolean;
        public createdAt!: Date;

        async validatePassword(attempt: string): Promise<boolean> {
            return compare(attempt, this.password);
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
            type: DataTypes.STRING(255),
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
            defaultValue: DataTypes.NOW
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

// Hook triggered before record is created to ensure password is hashed
Password.beforeCreate(async (passwordInstance) => {
    passwordInstance.password = await hash(passwordInstance.password, 12);

});

export default Password