import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../configs/database";

interface VenueTypeAttributes {
    id: string;
    name: string;
}

interface VenueTypeCreationAttributes extends Optional<VenueTypeAttributes, 'id'> {}

class VenueType extends Model<VenueTypeAttributes, VenueTypeCreationAttributes>
    implements VenueTypeAttributes {
        public id!: string;
        // Last Here
    }