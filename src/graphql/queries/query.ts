import gql from "graphql-tag";

export const GET_QUERY_LIST_BY_DATA_SOURCE_ID = gql`query getQueryListByDatasourceId($datasourceId: bigint!) {
    QUERY(where: {data_source_id: {_eq: $datasourceId}}) {
        id
        name
        table
        variables
        fields
        modify_date
    }
}`

export const GET_QUERY_BY_ID = gql`query geQueryById($id: bigint!) {
    QUERY(where: {id: {_eq: $id}}) {
        id
        name
        table
        limit
        order_by
        where
        fields
        variables
    }
}`

export const ADD_QUERY = gql`mutation addQuery($datasourceId: bigint!,$name: String!,$table: String!) {
    insert_QUERY(objects: {data_source_id: $datasourceId,name: $name,table: $table}) {
        returning {
            id
        }
    }
}`

export const UPDATE_QUERY = gql`mutation updateQuery(
    $id: bigint!,
    $name: String!,
    $table: String!,
    $limit: Int,
    $orderBy: String,
    $where: String,
    $fields: String,
    $variables: String,
    $modifyDate: date!
) {
    update_QUERY(where: {id: {_eq: $id}},_set: {
        name: $name,
        table: $table,
        limit: $limit,
        order_by: $orderBy,
        where: $where,
        fields: $fields,
        variables: $variables,
        modify_date: $modifyDate,
    }) {
        returning {
            id
        }
    }
}`

export const DELETE_QUERY = gql`mutation deleteQuery($id: bigint!) {
    delete_QUERY(where: {id: {_eq: $id}}) {
        returning {
            id
        }
    }
}`