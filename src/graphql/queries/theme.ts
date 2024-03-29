import gql from "graphql-tag";

export const GET_THEME_LIST_BY_USER_ID = gql`query getThemeListByUserId($userId: bigint!) {
    THEME(where: {user_id: {_eq: $userId}}) {
        id
        name
        primary_color
        secondary_color
        accent_color
        info_color
        success_color
        error_color,
        text_color_1,
        text_color_2,
        background_color
    }
}`

export const GET_THEME_BY_ID = gql`query geThemeById($id: bigint!) {
    THEME(where: {id: {_eq: $id}}) {
        id
        name
        primary_color
        secondary_color
        accent_color
        info_color
        success_color
        error_color,
        text_color_1,
        text_color_2,
        background_color
    }
}`

export const ADD_THEME = gql`mutation addTheme(
    $userId: bigint!,
    $name: String!,
    $primary: String!,
    $secondary: String!,
    $accent: String!,
    $info: String!,
    $success: String!,
    $error: String!
    $text1: String!,
    $text2: String!,
    $background: String!
) {
    insert_THEME(objects: {
        name: $name,
        user_id: $userId,
        primary_color: $primary,
        secondary_color: $secondary,
        accent_color: $accent,
        info_color: $info,
        success_color: $success,
        error_color: $error,
        text_color_1: $text1,
        text_color_2: $text2,
        background_color: $background
    }) {
        returning {
            id
        }
    }
}`

export const UPDATE_THEME = gql`mutation updateTheme(
    $id: bigint!,
    $name: String!,
    $primary: String!,
    $secondary: String!,
    $accent: String!,
    $info: String!,
    $success: String!,
    $error: String!
    $text1: String!,
    $text2: String!,
    $background: String!
) {
    update_THEME(where: {id: {_eq: $id}},_set: {
        name: $name,
        primary_color: $primary,
        secondary_color: $secondary,
        accent_color: $accent,
        info_color: $info,
        success_color: $success,
        error_color: $error,
        text_color_1: $text1,
        text_color_2: $text2,
        background_color: $background
    }) {
        returning {
            id
        }
    }
}
`

export const DELETE_THEME = gql`mutation deleteTheme($id: bigint!) {
    delete_THEME(where: {id: {_eq: $id}}) {
        returning {
            id
        }
    }
}`