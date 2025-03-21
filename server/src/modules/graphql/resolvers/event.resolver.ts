import { orm } from "@/models";
import { GraphQLError } from "graphql";

export const eventResolver = {
    Query: {
        event: async (parent: any, { id } : { id: string }, { user }: { user: any }) => {
            const event = await orm.Event.findByPk(id);
            console.log(user)
            if (!event) throw new GraphQLError("Event does not exist", { extensions: { code: "NOT_FOUND" } })

            if (user.role === "client" && event.client_id === user.roleId) {
                return event;
            } else if (user.role === "vendor") {
                
            } else if (user.role === "worker")

            return new GraphQLError("Unauthorized Request", { extensions: { code: "UNAUTHORIZED" } });
        }
    }
}