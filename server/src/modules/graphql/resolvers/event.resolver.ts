import { odm } from "@/models";
import { GraphQLError } from "graphql";

export const eventResolver = {
    Query: {
        event: async (parent: any, { id } : { id: string }, { user }: { user: any }) => {
            const event = await odm.eventModel.findById(id);
            console.log(user)
            if (!event) throw new GraphQLError("Event does not exist", { extensions: { code: "NOT_FOUND" } })

            if (user.role === "client" && event.client === user.roleId) {
                return event;
            } else if (user.role === "caterer") {
                
            } else if (user.role === "worker")

            return new GraphQLError("Unauthorized Request", { extensions: { code: "UNAUTHORIZED" } });
        }
    }
}