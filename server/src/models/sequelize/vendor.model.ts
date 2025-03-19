import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { getSequelizeInstance } from "../../config/postgres";

class Vendor extends Model<InferAttributes<Vendor>, InferCreationAttributes<Vendor>> {
    public id!: CreationOptional<string>;
    public business_name!: string;
    public description!: CreationOptional<string>;
    public business_address!: string;
    public industry!: string;
    public business_phone!: CreationOptional<string>;
    public business_email!: CreationOptional<string>;
    public business_website!: CreationOptional<string>;
    // public services!: number[];
}

Vendor.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        business_name: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        description: {
            type: DataTypes.STRING
        },
        business_address: {
            type: DataTypes.GEOMETRY('POINT'),
            allowNull: false
        },
        industry: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'vendor_industries',
                key: 'id'
            }
        },
        business_phone: {
            type: DataTypes.STRING
        },
        business_email: {
            type: DataTypes.STRING
        },
        business_website: {
            type: DataTypes.STRING
        },
        // Implement separate table for vendor_services
        // services: {
        //     type: DataTypes.ARRAY(DataTypes.INTEGER),
        //     allowNull: false,
        //     references: {
        //         model: 'industry_services',
        //         key: 'id'
        //     }
        // }
    },
    {
        tableName: 'vendors',
        modelName: 'Vendor',
        sequelize: getSequelizeInstance(),
        timestamps: true
    }
);

export default Vendor;