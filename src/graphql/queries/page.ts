import gql from "graphql-tag";

export const GET_PAGE_LIST_BY_PROJECT_ID = gql`query getPageListByProjectId($projectId: bigint!) {
    PAGE(where: {project_id: {_eq: $projectId}}) {
        id
        name
        definition
        params
        modify_date
    }
}`

export const ADD_PAGE = gql`mutation addPage($projectId: bigint!, $name: String!, $definition: jsonb!, $params: String) {
    insert_PAGE(objects: {project_id: $projectId,name: $name, definition: $definition, params: $params}){
        returning {
            id
        }
    }
}`

export const UPDATE_PAGE_DEFINITION = gql`mutation updatePageDefinition(
    $id: bigint!,
    $definition: jsonb!,
    $modifyDate: date!,
    $params: String
) {
    update_PAGE(where: {id: {_eq: $id}},_set: {definition: $definition,modify_date: $modifyDate, params: $params}) {
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