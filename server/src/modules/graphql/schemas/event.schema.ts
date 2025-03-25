import { gql } from "graphql-tag";
import { EventState } from "@/types";


export const  eventTypeDefs = gql`
    enum EventStates {
        ${Object.values(EventState)}
    }

    type Location {
        type: String!
        coordinates: [Float!]!
    }

    type Event {
        id: ID!
        eventType: Int!
        status: EventStates!
        location: Location
        scheduledStart: String!
        scheduledEnd: String!
    }

    type Query {
        event(id: ID!): Event
    }
`;