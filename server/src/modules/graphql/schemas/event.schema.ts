import { gql } from "graphql-tag";

export const eventTypeDefs = gql`
    type Event {
        id: ID!
        eventType: String!
        scheduledStart: Date;
        scheduledEnd: Date;
    }

    type Query {
        events: [Event!]!
        event(id: ID!): Event
    }

    type Mutation {
        createEvent(title: String!, date: String!): Event!
    }
`;