import gql from "graphql-tag";

export const GET_USER_PROJECTS = gql`query getAllUserProjects($user_id: bigint!) {
    PROJECT(where: {user_id: {_eq: $user_id}}) {
        id
        name
        description
        create_date
    }
}`

export const GET_PROJECT_BY_ID = gql`query getProjectById($id: bigint!) {
    PROJECT(where: {id: {_eq: $id}}) {
        name
        description
        theme_id
        id
    }
}`

export const GET_PROJECTS_WITH_THEME = gql`query getProjectsWithTheme($id: bigint!) {
    PROJECT(where: {theme_id: {_eq: $id}}) {
        id
    }
}`

export const ADD_PROJECT_FOR_USER = gql`mutation addProjectForUser(
    $user_id: bigint!,
    $name: String!,
    $description: String!,
    $theme_id: bigint!
) {
    insert_PROJECT(objects: {
        description: $description,
        name: $name, definition: "",
        user_id: $user_id,
        theme_id: $theme_id
    })
    {
        returning {
            id
        }
    }
}`

export const UPDATE_PROJECT_FOR_ID = gql`mutation updateThemeForId(
    $id: bigint!,
    $name: String!,
    $description: String!,
    $theme_id: bigint!
) {
    update_PROJECT(
        where: {id: {_eq: $id}},
        _set: {
            name: $name,
            description: $description,
            theme_id: $theme_id,
        }) {
        returning {
            id
        }
    }
}
`

export const DELETE_PROJECT = gql`mutation deleteProject($id: bigint!) {
    delete_PROJECT(where: {id: {_eq: $id}}) {
        returning {
            id
        }
    }
}`