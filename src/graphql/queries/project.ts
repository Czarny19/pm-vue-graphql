import gql from "graphql-tag";

export const GET_PROJECT_LIST_BY_USER_ID = gql`query getProjectListByUserId($userId: bigint!) {
    PROJECT(where: {user_id: {_eq: $userId}}) {
        id
        name
        description
        create_date
        project_theme {
            name
        },
        project_data_source {
            name
        }
    }
}`

export const GET_PROJECT_BY_ID = gql`query getProjectById($id: bigint!) {
    PROJECT(where: {id: {_eq: $id}}) {
        name
        description
        theme_id
        source_id
        id
    }
}`

export const GET_PROJECT_LIST_BY_THEME_ID = gql`query getProjectListByThemeId($id: bigint!) {
    PROJECT(where: {theme_id: {_eq: $id}}) {
        id
    }
}`

export const GET_PROJECT_LIST_BY_DATA_SOURCE_ID = gql`query getProjectListByDatasourceId($id: bigint!) {
    PROJECT(where: {source_id: {_eq: $id}}) {
        id
    }
}`

export const ADD_PROJECT = gql`mutation addProject(
    $userId: bigint!,
    $name: String!,
    $description: String!,
    $themeId: bigint!,
    $datasourceId: bigint
) {
    insert_PROJECT(objects: {
        description: $description,
        name: $name,
        definition: "",
        user_id: $userId,
        theme_id: $themeId
        source_id: $datasourceId
    })
    {
        returning {
            id
        }
    }
}`

export const UPDATE_PROJECT = gql`mutation updateProject(
    $id: bigint!,
    $name: String!,
    $description: String!,
    $themeId: bigint!,
    $datasourceId: bigint
) {
    update_PROJECT(where: {id: {_eq: $id}},_set: {
        name: $name,
        description: $description,
        theme_id: $themeId,
        source_id: $datasourceId
    }) {
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