import gql from "graphql-tag";

export const typeDefs = gql`
    type User {
        id: ID!
        username: String!
        email: String!
    }
`;