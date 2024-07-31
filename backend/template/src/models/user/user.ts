import { Schema, model, Document } from "mongoose";
import { UserRole } from "../../config/roles";

interface UserInterface extends Document {
    name: string;
    email?: string;
    phone?: string;
    password: string;
    role: UserRole;
    profile_image: string;
    date_registered: Date;
}

const userSchema = new Schema<UserInterface>({
    name: {
        type: String,
        maxlength: 30,
        lowercase: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: function() {
            return !this.phone;
        }
    },
    phone: {
        type: String,
        required: function() {
            return !this.email;
        }
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: Object.values(UserRole)
    }
}, {
    collection: 'users',
    discriminatorKey: 'variant',
    timestamps: true
});

const User = model<UserInterface>('User', userSchema);

export default User;
export { UserInterface };