import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, Sequelize } from "sequelize";

export class VendorIndustry extends Model<InferAttributes<VendorIndustry>, InferCreationAttributes<VendorIndustry>> {
    public id!: CreationOptional<number>;
    public name!: string;
    public description!: CreationOptional<string>;
}

export const initVendorIndustryModel = (sequelize: Sequelize) => {
    VendorIndustry.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING
            }
        },
        {
            tableName: 'vendor_industries',
            modelName: 'VendorIndustry',
            sequelize,
            timestamps: false
        }
    );
}

export const associateVendorIndustryModel = (orm: {
    
}) => {

}