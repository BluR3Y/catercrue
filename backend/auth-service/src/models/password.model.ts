import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../configs/database";
import { compare, hash } from "bcrypt";

interface PasswordAttributes {
    id: string;
    userId: string;
    password: string;
    salt: string;
}

interface PasswordCreationAttributes extends Optional<PasswordAttributes, 'id'> {}

class Password extends Model<PasswordAttributes, PasswordCreationAttributes>
    implements PasswordAttributes {
        public id!: string;
        public userId!: string;
        public password!: string;
        public salt!: string;

        static async hashPassword(password: string): Promise<string> {
            const saltRounds = 12;
            return hash(password, saltRounds);
        }

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
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(128),
            allowNull: false
        },
        salt: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: 'passwords',
        modelName: 'User',
        sequelize,
        timestamps: true
    }
);

export default Password;