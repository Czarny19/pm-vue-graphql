import gql from "graphql-tag";

export const GET_PAGES_FOR_PROJECT = gql`query getPagesForProject($projectId: bigint!) {
    PAGE(where: {project_id: {_eq: $projectId}}) {
        id
        name
        modify_date
    }
}`

export const GET_PAGE_BY_ID = gql`query getPageById($id: bigint!) {
    PAGE(where: {id: {_eq: $id}}) {
        id
        name
        definition
        modify_date
    }
}`

export const ADD_PAGE_FOR_PROJECT = gql`mutation addPageForProject($projectId: bigint!, $name: String!) {
    insert_PAGE(objects: {project_id: $projectId,name: $name}){
        returning {
            id
        }
    }
}`

export const UPDATE_PAGE_DEFINITION_BY_ID = gql`mutation updatePageDefinitionById(
    $id: bigint!,
    $definition: jsonb!,
    $modifyDate: date!,
) {
    update_PAGE(where: {id: {_eq: $id}},_set: {definition: $definition,modify_date: $modifyDate}) {
        returning {
            id
        }
    }
}`

export const DELETE_PAGE = gql`mutation deletePage($id: bigint!) {
    delete_PAGE(where: {id: {_eq: $id}}) {
        returning {
            id
        }
    }
}`