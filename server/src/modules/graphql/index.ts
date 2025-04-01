import { ApolloServer } from "@apollo/server";
import express, { Application } from "express";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { Server } from "http";
import authContext from "./context/auth.context";
import { typeDefs } from "./schemas";
import { resolvers } from "./resolvers";
import logger from "@/config/winston";

export default async function(app: Application, httpServer: Server) {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
        formatError: (formattedErr, err) => {
            const  { extensions, message } = formattedErr;
            let returnErr;

            if (extensions?.code === "INTERNAL_SERVER_ERROR") {
                // Log error with stack trace (if available)
                const stackTrace = extensions.stacktrace || "No stack trace available";
                logger.error(message, { stack: stackTrace });

                returnErr = {
                    message: "An unexpected error occured",
                    extensions: {
                        code: extensions.code
                    }
                }
            } else {
                // Ensure we always return a GraphQl error structure
                returnErr = {
                    message,
                    extensions: {
                        code: extensions?.code || "UNKNOWN_ERROR"
                    }
                }
            }

            return returnErr;
        }
    });
    await server.start();   // Ensure the server starts before applying middleware

    app.use(express.json());
    app.use("/graphql", expressMiddleware(server, {
        context: authContext
    } as any) as any)
}