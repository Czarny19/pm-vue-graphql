import gql from "graphql-tag";

export const GET_DATA_SOURCE_QUERIES = gql`query getDataSourceQueries($datasourceId: bigint!) {
    QUERY(where: {data_source_id: {_eq: $datasourceId}}) {
        id
        name
        table
        modify_date
    }
}`

export const GET_QUERY_BY_ID = gql`query geQueryById($id: bigint!) {
    QUERY(where: {id: {_eq: $id}}) {
        id
        name
        table
        distinct_on
        limit
        order_by
        where
        fields
    }
}`

export const ADD_QUERY = gql`mutation addQuery($datasourceId: bigint!,$name: String!,$table: String!) {
    insert_QUERY(objects: {data_source_id: $datasourceId,name: $name,table: $table}) {
        returning {
            id
        }
    }
}`

export const UPDATE_QUERY_BY_ID = gql`mutation updateQueryById(
    $id: bigint!,
    $name: String!,
    $table: String!,
    $distinct_on: String,
    $limit: Int,
    $orderBy: String,
    $where: String,
    $fields: String
) {
    update_QUERY(where: {id: {_eq: $id}},_set: {
        name: $name,
        table: $table,
        distinct_on: $distinct_on,
        limit: $limit,
        order_by: $orderBy,
        where: $where,
        fields: $fields,
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