import gql from "graphql-tag";

export const GET_USER_PROJECTS_QUERY = gql`query getAllUserProjects($user_id: bigint!) {
    PROJECT(where: {user_id: {_eq: $user_id}}) {
        id
        name
        description
        create_date
    }
}`

export const GET_PROJECT_BY_ID_QUERY = gql`query getProjectById($id: bigint!) {
    PROJECT(where: {id: {_eq: $id}}) {
        name
        description
        id
    }
}`