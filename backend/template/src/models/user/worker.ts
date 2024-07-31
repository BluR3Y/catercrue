import { StaffRole } from '../../config/roles';
import { AddressInterface, addressSchema } from '../shared/address';
import User, { UserInterface } from './user';
import { Schema } from 'mongoose';

interface WorkerInterface extends UserInterface {
    address: AddressInterface;
    resume: string;
    staff_roles: string[];
    about_me: string;
}

const workerSchema = new Schema<WorkerInterface>({
    address: {
        type: addressSchema
    },
    resume: {
        type: String,
        default: null
    },
    staff_roles: {
        type: [String],
        enum: Object.values(StaffRole),
        default: []
    },
    about_me: {
        type: String,
        maxlength: 600
    }
});

const Worker = User.discriminator<WorkerInterface>('Worker', workerSchema);

export default Worker;
export { WorkerInterface };