import gql from "graphql-tag";

export const GET_DATA_SOURCE_LIST_BY_USER_ID = gql`query getDatasourceListByUserId($userId: bigint!) {
    DATA_SOURCE(where: {user_id: {_eq: $userId}}) {
        id
        name
        address
        secret
        create_date
    }
}`

export const GET_DATA_SOURCE_BY_ID = gql`query getDatasourceById($id: bigint!) {
    DATA_SOURCE(where: {id: {_eq: $id}}) {
        id
        name
        address
        secret
        create_date
    }
}`

export const ADD_DATA_SOURCE = gql`mutation addDatasource(
    $userId: bigint!,
    $name: String!,
    $address: String!,
    $secret: String
) {
    insert_DATA_SOURCE(objects: {
        user_id: $userId,
        name: $name,
        address: $address,
        secret: $secret,
    }) {
        returning {
            id
        }
    }
}`

export const UPDATE_DATA_SOURCE = gql`mutation updateDatasource(
    $id: bigint!,
    $name: String!,
    $address: String!,
    $secret: String
) {
    update_DATA_SOURCE(where: {id: {_eq: $id}},_set: {
        name: $name,
        address: $address,
        secret: $secret,
    }) {
        returning {
            id
        }
    }
}`

export const DELETE_DATA_SOURCE = gql`mutation deleteDatasource($id: bigint!) {
    delete_DATA_SOURCE(where: {id: {_eq: $id}}) {
        returning {
            id
        }
    }
}`