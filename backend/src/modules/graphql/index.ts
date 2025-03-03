import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { Server } from "http";

const typeDefs = `#graphql
    type Query {
        hello: String
    }
`;

const resolvers = {
    Query: {
        hello: () => 'world',
    },
};

export default async function(httpServer: Server) {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
    });
    await server.start();   // Ensure the server starts before applying middleware
    return server;
}