import gql from "graphql-tag";

export const GET_USER_BY_ID = gql`query USER($userId: bigint!) {
    USER(where: {id: {_eq: $userId}}) {
        email
        username
        id
    }
}`

export const GET_USER_BY_EMAIL = gql`query USER($email: String!) {
    USER(where: {email: {_eq: $email}}) {
        email
        username
        id
    }
}`

export const ADD_USER = gql`mutation addUser($email: String!,$username: String!) {
    insert_USER(objects: {email: $email, username: $username}) {
        returning {
            id
        }
    }
}`

export const UPDATE_USER_USERNAME = gql`mutation updateUserUsername($id: bigint!,$username: String!) {
    update_USER(where: {id: {_eq: $id}},_set: {username: $username}) {
        returning {
            id
        }
    }
}`

export const CURRENT_USER = gql`
    {
        currentUser @client {
            id
            username
            email
        }
    }
`;