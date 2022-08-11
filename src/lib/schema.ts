import ApolloClient from "apollo-client";
import {typeDefs} from "@/graphql/typedefs";
import {HttpLink} from "apollo-link-http";
import {InMemoryCache} from "apollo-cache-inmemory";
import {GET_SCHEMA} from "@/graphql/queries/schema";
import {cryptoKey} from "@/main";
import * as Types from "@/lib/types";
import * as CryptoJS from "crypto-js";

/**
 * Downloads a graphQL endpoint schema.
 * @param endpoint Address of and existing graphQL endpoint
 * @param secret GraphQL endpoint secret (null if the endpoint is not secured)
 * @returns Promise containing the graphQL schema in a clean form {@link CleanSchemaConnectionResult}.
 **/
export const getCleanGraphQLSchema = async (endpoint: string,
                                            secret?: string): Promise<Types.CleanSchemaConnectionResult> => {
    const result = await getGraphQLSchema(endpoint, secret)
    return {schema: cleanSchema(result.schema), errorMsg: result.errorMsg}
}

/**
 * Downloads a graphQL endpoint schema.
 * @param endpoint Address of and existing graphQL endpoint
 * @param secret GraphQL endpoint secret (null if the endpoint is not secured)
 * @returns Promise containing the graphQL schema as returned from the schema query {@link SchemaConnectionResult}.
 **/
export const getGraphQLSchema = async (endpoint: string, secret?: string): Promise<Types.SchemaConnectionResult> => {
    const linkOptions = {uri: endpoint, headers: schemaHeaders(secret)}

    const client = new ApolloClient({
        typeDefs: typeDefs,
        link: new HttpLink(linkOptions),
        cache: new InMemoryCache({addTypename: true}),
        resolvers: {}
    })

    return await client.query({query: GET_SCHEMA, fetchPolicy: 'no-cache'}).then(response => {
        const schema = response.data.__schema.types
        return {schema: schema, errorMsg: ''}
    }).catch(err => {
        return {schema: [], errorMsg: err}
    })
}

/**
 * Decodes the datasource secret that has been encoded for storage in admin db.
 * @param secret GraphQL endpoint encoded secret (null if the endpoint is not secured)
 * @returns Usable datasource secret.
 **/
export const decodeDatasourceSecret = (secret: string): string =>
    CryptoJS.AES.decrypt(secret, cryptoKey).toString(CryptoJS.enc.Utf8)

/**
 * Encodes the datasource secret that can be stored in admin db.
 * @param secret GraphQL endpoint secret (null if the endpoint is not secured)
 * @returns Encoded datasource secret.
 **/
export const encodeDatasourceSecret = (secret: string): string =>
    CryptoJS.AES.decrypt(secret, cryptoKey).toString(CryptoJS.enc.Utf8)

const ignoredObjects = [
    '_aggregate', '_aggregate_fields', '_avg_fields', '_max_fields', '_min_fields', '_mutation_response',
    '_stddev_fields', '_stddev_pop_fields', '_stddev_samp_fields', '_sum_fields', '_var_pop_fields',
    '_var_samp_fields', '_variance_fields', '__Directive', '__EnumValue', '__Field', '__InputValue',
    '_Schema', '__Type', 'mutation_root', 'query_root', 'subscription_root'
]

const schemaHeaders = (secret?: string): Types.SchemaConnectionHeaders => {
    const headers = {'authorization': '', 'content-type': '', 'x-hasura-admin-secret': ''}
    const token = window.localStorage.getItem('apollo-token')
    if (token) headers.authorization = `Bearer ${token}`
    headers['content-type'] = 'application/json'
    headers['x-hasura-admin-secret'] = secret ?? ''
    return headers
}

const cleanSchema = (schema: unknown []): Types.SchemaItem [] => {
    const cleanSchema: Types.SchemaItem [] = [];

    schema.forEach(item => {
        const schemaItem = (item as { kind: string, fields: [], name: string, description: string | undefined })
        const cleanSchemaItemFields: Types.SchemaItemField[] = []

        const isObject = schemaItem.kind === 'OBJECT';
        const hasFields = schemaItem.fields;
        const nameNotIgnored = ignoredObjects.filter(ignored => schemaItem.name.endsWith(ignored)).length == 0

        if (isObject && hasFields && nameNotIgnored) {
            schemaItem.fields.forEach(field => {
                const schemaField = (field as { name: string, type: { kind: string, name: string, ofType: { name: string } } })

                let fieldType: string
                let isNullable: boolean

                switch (schemaField.type.kind) {
                    case 'OBJECT':
                        fieldType = 'Object'
                        isNullable = true
                        break;
                    case 'NON_NULL':
                        fieldType = schemaField.type.ofType.name
                        isNullable = false
                        break;
                    default:
                        fieldType = schemaField.type.name
                        isNullable = true
                        break;
                }

                cleanSchemaItemFields.push({name: schemaField.name, type: fieldType, isNullable: isNullable})
            })

            cleanSchema.push({
                name: schemaItem.name,
                kind: schemaItem.kind,
                description: schemaItem.description ?? '',
                fields: cleanSchemaItemFields
            })
        }
    })

    return cleanSchema;
}