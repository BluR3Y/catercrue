import { ApolloServer } from "@apollo/server";
import { Application } from "express";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { Server } from "http";
import authContext from "./context/auth.context";
import express from "express";
import { typeDefs } from "./schemas";
import { resolvers } from "./resolvers";

export default async function(app: Application, httpServer: Server) {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
    });
    app.use(express.json());
    await server.start();   // Ensure the server starts before applying middleware
    
    app.use("/graphql", expressMiddleware(server, {
        context: authContext
    } as any) as any)
}