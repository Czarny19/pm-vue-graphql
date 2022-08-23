import gql from "graphql-tag";

export const GET_PROP_LIST_BY_PAGE_ID = gql`query getPropListByPageId($pageId: bigint!) {
    PROP(where: {page_id: {_eq: $pageId}}) {
        id
        name
        type
        type_display
        value
    }
}`

export const ADD_PROP = gql`mutation addProp(
    $pageId: bigint!, $name: String!, $type: String!, $type_display: String!, $value: String!
) {
    insert_PROP(objects: {page_id: $pageId,name: $name, type: $type, type_display: $type_display, value: $value}){
        returning {
            id
        }
    }
}`

export const DELETE_PROP = gql`mutation deleteProp($id: bigint!) {
    delete_PROP(where: {id: {_eq: $id}}) {
        returning {
            id
        }
    }
}`