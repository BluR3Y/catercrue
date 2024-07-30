import { Schema } from "mongoose";
import User, { UserInterface } from "./user";

interface CoordinatorInterface extends UserInterface {

}

const coordinatorSchema = new Schema<CoordinatorInterface>({

});

const Coordinator = User.discriminator<CoordinatorInterface>('Host', coordinatorSchema);

export default Coordinator;
export { CoordinatorInterface };