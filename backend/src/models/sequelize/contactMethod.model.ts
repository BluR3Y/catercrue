import { DataTypes, Model, Optional } from "sequelize";
import { getSequelizeInstance } from "../../config/postgres";
import { Op } from "sequelize";

interface ContactMethodAttributes {
    id: string;
    userId: string;
    type: 'email' | 'phone';
    value: string;
    isVerified?: boolean;
    isPrimary: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

interface ContactMethodCreationAttributes extends Optional<ContactMethodAttributes, 'id'> {}

class ContactMethod extends Model<ContactMethodAttributes, ContactMethodCreationAttributes>
    implements ContactMethodAttributes {
        public id!: string;
        public userId!: string;
        public type!: 'email' | 'phone';
        public value!: string;
        public isVerified!: boolean;
        public isPrimary!: boolean;

        public readonly createdAt!: Date;
        public readonly updatedAt!: Date;
    }

ContactMethod.init(
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
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        isPrimary: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
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
                fields: ['userId', 'type']  // ensures one email and one phone per user
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
                userId: contact.userId,
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
                userId: contact.userId,
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