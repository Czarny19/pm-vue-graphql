import gql from "graphql-tag";

export const GET_SCHEMA = gql`query IntrospectionQuery {
    __schema {
        types {
            ...{
                kind
                name
                description
                fields(includeDeprecated: false) {
                    name
                    args {
                        ...{
                            name
                            type {
                                ...{
                                    kind
                                    name
                                    ofType {
                                        kind
                                        name
                                        ofType {
                                            kind
                                            name
                                            ofType {
                                                kind
                                                name
                                                ofType {
                                                    kind
                                                    name
                                                    ofType {
                                                        kind
                                                        name
                                                        ofType {
                                                            kind
                                                            name
                                                            ofType {
                                                                kind
                                                                name
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            defaultValue
                        }
                    }
                    type {
                        ...{
                            kind
                            name
                            ofType {
                                kind
                                name
                                ofType {
                                    kind
                                    name
                                    ofType {
                                        kind
                                        name
                                        ofType {
                                            kind
                                            name
                                            ofType {
                                                kind
                                                name
                                                ofType {
                                                    kind
                                                    name
                                                    ofType {
                                                        kind
                                                        name
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}`