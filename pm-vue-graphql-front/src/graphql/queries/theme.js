import gql from "graphql-tag";

export const GET_USER_THEMES_QUERY = gql`query getAllUserThemes($user_id: bigint!) {
    THEME(where: {user_id: {_eq: $user_id}}) {
        id
        name
        create_date
        primary_color
        secondary_color
        accent_color
    }
}`