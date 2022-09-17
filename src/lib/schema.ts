import ApolloClient from "apollo-client";
import {typeDefs} from "@/graphql/typedefs";
import {GET_SCHEMA} from "@/graphql/queries/schema";
import {dataSourceCryptoKey} from "@/main";
import * as Types from "@/lib/types";
import {SchemaItem, SchemaItemField} from "@/lib/types";
import {HttpLink} from "apollo-link-http";
import {InMemoryCache} from "apollo-cache-inmemory";
import * as CryptoJS from "crypto-js";

/**
 * Downloads a graphQL endpoint schema.
 * @param endpoint Address of and existing graphQL endpoint
 * @param secret GraphQL endpoint secret (null if the endpoint is not secured)
 * @returns Promise containing the graphQL schema in a clean form {@link CleanSchemaConnectionResult}.
 **/
export const getCleanGraphQLSchema = async (endpoint: string,
                                            secret?: string): Promise<Types.CleanSchemaConnectionResult> => {
    const result = await getGraphQLSchema(endpoint, secret);
    return {schema: cleanSchema(result.schema), errorMsg: result.errorMsg};
}

/**
 * Downloads a graphQL endpoint schema.
 * @param endpoint Address of and existing graphQL endpoint
 * @param secret GraphQL endpoint secret (null if the endpoint is not secured)
 * @returns Promise containing the graphQL schema as returned from the schema query {@link SchemaConnectionResult}.
 **/
export const getGraphQLSchema = async (endpoint: string, secret?: string): Promise<Types.SchemaConnectionResult> => {
    const linkOptions = {uri: endpoint, headers: schemaHeaders(secret)};

    const client = new ApolloClient({
        typeDefs: typeDefs,
        link: new HttpLink(linkOptions),
        cache: new InMemoryCache({addTypename: true}),
        resolvers: {}
    });

    return await client.query({query: GET_SCHEMA, fetchPolicy: 'no-cache'}).then(response => {
        const schema = response.data.__schema.types;
        return {schema: schema, errorMsg: ''};
    }).catch(err => {
        return {schema: [], errorMsg: err};
    });
}

/**
 * Creates a full list of table fields inculing object (single) relationships (In form of [relation].fieldName).
 * @param table The base table
 * @param schema GraphQL schema
 * @returns The list of all fields for the specified table {@link SchemaItemField}.
 **/
export const getAllTableFieldsWithObjectRelations = (table: string, schema: SchemaItem[]): SchemaItemField[] => {
    const fields: SchemaItemField[] = [];
    const schemaItems = (schema as SchemaItem[]).slice();
    const tableFields = schemaItems?.find((schemaItem) => schemaItem.name === table)?.fields.slice();

    tableFields?.filter((field) => !field.isList).forEach((field) => {
        if (schemaItems.map((item) => item.name).includes(field.type)) {
            getRelatedFields(field.name, fields, field, schemaItems);
        } else {
            fields.push(field);
        }
    })

    return fields;
}

/**
 * Creates a full list of table array (multiple) relationships.
 * @param table The base table
 * @param schema GraphQL schema
 * @returns The list of all fields for the specified table {@link SchemaItemField}.
 **/
export const getTableArrayRelations = (table: string, schema: SchemaItem[]): SchemaItemField[] => {
    const schemaItems = (schema as SchemaItem[]).slice();
    const tableFields = schemaItems?.find((schemaItem) => schemaItem.name === table)?.fields.slice();

    return tableFields?.filter((field) => field.isList) ?? [];
}

const getRelatedFields = (path: string, fields: SchemaItemField[], field: SchemaItemField, schema: SchemaItem[]) => {
    schema.find((item) => item.name === field.type)?.fields.slice().forEach((fld) => {
        if (schema.map((item) => item.name).includes(fld.type)) {
            getRelatedFields(`${path}.${fld.name}`, fields, fld, schema);
        } else {
            const relationshipField = {name: fld.name, type: fld.type, isNullable: fld.isNullable, isList: fld.isList};
            relationshipField.name = `${path.length ? path + '.' : ''}${fld.name}`;
            fields.push(relationshipField);
        }
    });
}

/**
 * Decodes the datasource secret that has been encoded for storage in admin db.
 * @param secret GraphQL endpoint encoded secret (null if the endpoint is not secured)
 * @returns Usable datasource secret.
 **/
export const decodeDatasourceSecret = (secret: string): string =>
    CryptoJS.AES.decrypt(secret, dataSourceCryptoKey).toString(CryptoJS.enc.Utf8);

/**
 * Encodes the datasource secret that can be stored in admin db.
 * @param secret GraphQL endpoint secret (null if the endpoint is not secured)
 * @returns Encoded datasource secret.
 **/
export const encodeDatasourceSecret = (secret: string): string =>
    CryptoJS.AES.decrypt(secret, dataSourceCryptoKey).toString(CryptoJS.enc.Utf8);

const ignoredObjects = [
    '_aggregate', '_aggregate_fields', '_avg_fields', '_max_fields', '_min_fields', '_mutation_response',
    '_stddev_fields', '_stddev_pop_fields', '_stddev_samp_fields', '_sum_fields', '_var_pop_fields',
    '_var_samp_fields', '_variance_fields', '__Directive', '__EnumValue', '__Field', '__InputValue',
    '_Schema', '__Type', 'mutation_root', 'query_root', 'subscription_root'
];

const schemaHeaders = (secret?: string): Types.SchemaConnectionHeaders => {
    const headers = {'authorization': '', 'content-type': '', 'x-hasura-admin-secret': ''};
    const token = window.localStorage.getItem('apollo-token');
    if (token) headers.authorization = `Bearer ${token}`;
    headers['content-type'] = 'application/json';
    headers['x-hasura-admin-secret'] = secret ?? '';
    return headers;
}

const cleanSchema = (schema: unknown []): Types.SchemaItem [] => {
    const cleanSchema: Types.SchemaItem [] = [];

    schema.forEach(item => {
        const schemaItem = (item as { kind: string, fields: [], name: string, description: string | undefined });
        const cleanSchemaItemFields: Types.SchemaItemField[] = [];

        const isObject = schemaItem.kind === 'OBJECT';
        const hasFields = schemaItem.fields;
        const nameNotIgnored = ignoredObjects.filter(ignored => schemaItem.name.endsWith(ignored)).length == 0;

        const listObjects: string[] = [];

        if (isObject && hasFields && nameNotIgnored) {
            schemaItem.fields.forEach(field => {
                const schemaField = (field as {
                    name: string, type: { kind: string, name: string, ofType: { name: string, kind: string } }
                });

                let fieldType: string | null;
                let isNullable: boolean;

                switch (schemaField.type.kind) {
                    case 'OBJECT':
                        fieldType = schemaField.type.name;
                        isNullable = true;
                        break
                    case 'NON_NULL':
                        if (schemaField.type.ofType.kind === 'LIST') {
                            listObjects.push(schemaField.name);
                            fieldType = null;
                        } else if (schemaField.type.ofType.kind === 'OBJECT') {
                            fieldType = schemaField.type.ofType.name.replaceAll('_aggregate', '');
                        } else {
                            fieldType = schemaField.type.ofType.name;
                        }

                        isNullable = false;
                        break;
                    default:
                        fieldType = schemaField.type.name;
                        isNullable = true;
                        break;
                }

                if (fieldType != null) {
                    const name = schemaField.name.replaceAll('_aggregate', '');

                    cleanSchemaItemFields.push({
                        name: name, type: fieldType, isList: listObjects.includes(name), isNullable: isNullable
                    });
                }
            })

            cleanSchema.push({
                name: schemaItem.name,
                kind: schemaItem.kind,
                description: schemaItem.description ?? '',
                fields: cleanSchemaItemFields
            });
        }
    });

    return cleanSchema;
}