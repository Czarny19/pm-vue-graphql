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

export const ADD_PROJECT_FOR_USER = gql`mutation addProjectForUser(
    $user_id: bigint!,
    $name: String!,
    $description: String!
) {
    insert_PROJECT(objects: {description: $description, name: $name, definition: "", user_id: $user_id}) {
        returning {
            id
        }
    }
}`

export const DELETE_PROJECT = gql`mutation deleteProject($id: bigint!) {
    delete_PROJECT(where: {id: {_eq: $id}}) {
        returning {
            id
        }
    }
}`