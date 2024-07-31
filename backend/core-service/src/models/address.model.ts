import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface AddressAttributes {
    id: string;
    country: string;
    state: string;
    city: string;
    zip: string;
    street: string;
}

interface AddressCreationAttributes extends Optional<AddressAttributes, 'id'> {}

class Address extends Model<AddressAttributes, AddressCreationAttributes>
    implements AddressAttributes {
        public id!: string;
        public country!: string;
        public state!: string;
        public city!: string;
        public zip!: string;
        public street!: string;
    }

Address.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        country: {
            type: DataTypes.STRING(64),
            allowNull: false,
            validate: {
                isAlpha: true
            }
        },
        state: {
            type: DataTypes.STRING(64),
            allowNull: false,
            validate: {
                isAlpha: true
            }
        },
        city: {
            type: DataTypes.STRING(64),
            allowNull: false,
            validate: {
                isAlpha: true
            }
        },
        zip: {
            type: DataTypes.STRING(16),
            allowNull: false,
            validate: {
                is: {
                    args: /^\d{5}(-\d{4})?$/,
                    msg: 'Invalid zip code'
                }
            }
        },
        street: {
            type: DataTypes.STRING(128),
            allowNull: false
        }
    },
    {
        tableName: 'addresses',
        sequelize
    }
);

export default Address;