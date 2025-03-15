import { gql } from "graphql-tag";

export const eventTypeDefs = gql`
    type Event {
        id: ID!
        eventType: String!
        scheduledStart: String!
        scheduledEnd: String!
    }

    type Query {
        events: [Event!]!
        getEvent(id: ID!): Event
    }

    type Mutation {
        createEvent(title: String!, date: String!): Event!
    }
`;