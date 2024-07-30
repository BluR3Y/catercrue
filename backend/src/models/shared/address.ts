import { Schema } from "mongoose";

export interface AddressInterface {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

export const addressSchema = new Schema<AddressInterface>({
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    }
});