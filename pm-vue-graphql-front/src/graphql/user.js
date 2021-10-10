import gql from "graphql-tag";

export const GET_USER_QUERY = gql`query USER($email: String!) {
    USER(where: {email: {_eq: $email}}) {
        email
        id
    }
}`