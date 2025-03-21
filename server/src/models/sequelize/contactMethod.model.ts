import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { getSequelizeInstance } from "../../config/postgres";
import { Op } from "sequelize";

class ContactMethod extends Model<InferAttributes<ContactMethod>, InferCreationAttributes<ContactMethod>> {
    public id!: CreationOptional<string>;
    public user_id!: string;
    public type!: 'email' | 'phone';
    public value!: string;
    public isPrimary!: CreationOptional<boolean>;

    public readonly createdAt!: CreationOptional<Date>;
    public readonly updatedAt!: CreationOptional<Date>;
}

ContactMethod.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        type: {
            type: DataTypes.ENUM,
            values: ['email','phone'],
            allowNull: false
        },
        value: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        isPrimary: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    },
    {
        tableName: 'contact_methods',
        modelName: 'ContactMethod',
        sequelize: getSequelizeInstance(),
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['user_id', 'type']  // ensures one email and one phone per user
            }
        ]
    }
);

ContactMethod.beforeValidate((contact) => {
    const { type, value } = contact;
    if (type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            throw new Error('Invalid email format');
        }
        contact.value = value.toLowerCase().trim();
    } else if (type === 'phone') {
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;    // Follows E.164 format
        if (!phoneRegex.test(value)) {
            throw new Error('Invalid phone number format');
        }
    }
});

ContactMethod.beforeSave(async (contact, options) => {
    // Prevent duplicate contact types per user
    if (contact.isNewRecord || contact.changed('type')) {
        const existingType = await ContactMethod.findOne({
            where: {
                user_id: contact.user_id,
                type: contact.type,
                id: { [Op.ne]: contact.id }
            }
        });
        if (existingType) {
            throw new Error(`User already has a ${contact.type} contact method`);
        }
    }

    // Ensure only one primary contact per user
    if (contact.isPrimary) {
        const currentPrimary = await ContactMethod.findOne({
            where: {
                user_id: contact.user_id,
                isPrimary: true,
                id: { [Op.ne]: contact.id } // exclude self if updating
            }
        });

        if (currentPrimary) {
            currentPrimary.isPrimary = false;
            await currentPrimary.save();
        }
    }
});


export default ContactMethod;