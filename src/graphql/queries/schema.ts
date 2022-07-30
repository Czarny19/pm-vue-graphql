import gql from "graphql-tag";

export const GET_SCHEMA = gql`{
    __schema {
        types {
            name
            description
            kind
            fields {
                name
                type {
                    ofType {
                        name
                    }
                }
            }
        }
    }
}`