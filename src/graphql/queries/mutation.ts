import gql from "graphql-tag";

export const GET_MUTATION_LIST_BY_DATA_SOURCE_ID = gql`query getMutationListByDatasourceId($datasourceId: bigint!) {
    MUTATION(where: {data_source_id: {_eq: $datasourceId}}) {
        id
        name
        table
        type
        modify_date
    }
}`

export const GET_MUTATION_BY_ID = gql`query getMutationById($id: bigint!) {
    MUTATION(where: {id: {_eq: $id}}) {
        id
        name
        table
        fields
        where
        variables
        type
    }
}`

export const ADD_MUTATION = gql`mutation addMutation(
    $datasourceId: bigint!,$name: String!,$table: String!, $type: String!
) {
    insert_MUTATION(objects: {data_source_id: $datasourceId,name: $name,table: $table,type: $type}) {
        returning {
            id
        }
    }
}`

export const UPDATE_MUTATION = gql`mutation updateMutation(
    $id: bigint!,
    $name: String!,
    $table: String!,
    $fields: String,
    $where: String,
    $variables: String,
    $modifyDate: date!
) {
    update_MUTATION(where: {id: {_eq: $id}},_set: {
        name: $name,
        table: $table,
        fields: $fields,
        where: $where,
        variables: $variables,
        modify_date: $modifyDate,
    }) {
        returning {
            id
        }
    }
}`

export const DELETE_MUTATION = gql`mutation deleteMutation($id: bigint!) {
    delete_MUTATION(where: {id: {_eq: $id}}) {
        returning {
            id
        }
    }
}`