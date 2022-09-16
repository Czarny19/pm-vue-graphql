import ApolloClient from "apollo-client";
import {typeDefs} from "@/graphql/typedefs";
import {QueryOrderBy, QueryResult, QuerySetValue, QueryVariable, QueryWhere} from "@/lib/types";
import {HttpLink} from "apollo-link-http";
import {InMemoryCache} from "apollo-cache-inmemory";
import gql from "graphql-tag";

export const operatorTypes = new Map<string, string>([['=', '_eq'], ['!=', '_neq'], ['>', '_gt'],
    ['>=', '_gte'], ['<', '_lt'], ['<=', '_lte'], ['=null', '_is_null'], ['%', '_like'], ['!%', '_nlike']]);

export const numberOperators = ['=', '!=', '>', '>=', '=null', '<', '<='];

export const stringOperators = ['=', '!=', '>', '>=', '=null', '<', '<=', '%', '!%'];

export const boolOperators = ['=', '!=', '>', '>=', '=null', '<', '<='];

export const dateOperators = ['=', '!=', '>', '>=', '=null', '<', '<='];

export const timeOperators = ['=', '!=', '>', '>=', '=null', '<', '<='];

export const enum mutationType {
    Create = 'Create',
    Update = 'Update',
    Delete = 'Delete'
}

export const fieldAutoVar = 'Autom.';

/**
 * Runs a graphQL query on an existing table.
 * @param endpoint Address of and existing graphQL endpoint
 * @param query Query to run (can be generated using {@link generateGraphQLQuery})
 * @param table Name of the table that the query should be run on
 * @param secret GraphQL endpoint secret (null if the endpoint is not secured)
 * @param where Where condition (list of where condition parts {@link QueryWhere}).
 * @param vars Variables to be used with the query (list of order by condition parts {@link QueryOrderBy})
 * @returns Promise containing an object with the query result of type {@link QueryResult}.
 **/
export const runQuery = async (endpoint: string, query: string, table: string, secret?: string,
                               where?: QueryWhere[], vars?: QueryVariable[]): Promise<QueryResult> => {
    const whereSet = where != undefined && where.length;

    const emptyVars = (vars ?? [])
        .filter((variable) => !variable.value)
        .map((variable) => variable.name);

    let filteredWhere = [];
    let filteredWhereVarNames = [''];

    if (whereSet) {
        filteredWhere = [...where].filter((part) => part.required || !emptyVars.includes(part.variable));
        filteredWhereVarNames = filteredWhere.map((part) => part.variable.toString());
    }

    const filteredVars = vars?.filter((variable) => filteredWhereVarNames.includes(variable.name)) ?? [];

    let isSuccessful = true;
    let queryData: unknown[] = [];
    let queryError = '';

    const linkOptions = {uri: endpoint, headers: createQueryHeaders(secret)};

    const client = new ApolloClient({
        typeDefs: typeDefs,
        link: new HttpLink(linkOptions),
        cache: new InMemoryCache({addTypename: true}),
        resolvers: {}
    });

    const variablesMap: { [key: string]: string } = {};

    filteredVars.forEach((variable) => variablesMap[variable.name] = variable.value);

    try {
        await client.query({
            query: gql`${query}`,
            variables: variablesMap,
            fetchPolicy: 'network-only'
        }).then(response => {
            queryData = response.data[table];
        }).catch(err => {
            isSuccessful = false;
            queryError = err;
        });
    } catch (e) {
        isSuccessful = false;

        if (typeof e === "string") {
            queryError = e;
        } else if (e instanceof Error) {
            queryError = e.message;
        }
    }

    return {isSuccessful: isSuccessful, data: queryData, error: queryError};
}

/**
 * Runs a graphQL query and returns the total item count for a table.
 * @param endpoint Address of and existing graphQL endpoint
 * @param table Name of the table that the query should be run on
 * @param secret GraphQL endpoint secret (null if the endpoint is not secured)
 * @returns Number of items in a graphQL table.
 **/
export const getTableItemsCount = async (endpoint: string, table: string, secret?: string): Promise<number> => {
    const linkOptions = {uri: endpoint, headers: createQueryHeaders(secret)};

    const client = new ApolloClient({
        typeDefs: typeDefs,
        link: new HttpLink(linkOptions),
        cache: new InMemoryCache({addTypename: true}),
        resolvers: {}
    });

    const query = `query count { ${table} { __typename } }`;

    try {
        return await client.query({query: gql`${query}`, fetchPolicy: 'network-only'}).then(response => {
            return response.data[table].length;
        })
    } catch (e) {
        return 0;
    }
}

/**
 * Runs a graphQL mutation on an existing table.
 * @param endpoint Address of and existing graphQL endpoint
 * @param mutation Mutation to run (can be generated using {@link generateGraphQLMutation})
 * @param table Name of the table that the query should be run on
 * @param type Type of the mutation (Create, Update, Delete {@link mutationType})
 * @param secret GraphQL endpoint secret (null if the endpoint is not secured)
 * @param vars Variables to be used with the query, separated with ';' (null if there are no query variables)
 * @returns Promise containing an object with the mutation result of type {@link QueryResult}.
 **/
export const runMutation = async (endpoint: string, mutation: string, table: string, type: mutationType,
                                  secret?: string, vars?: string): Promise<QueryResult> => {
    let isSuccessful = true;
    let queryData: unknown[] = [];
    let queryError = '';

    const linkOptions = {uri: endpoint, headers: createQueryHeaders(secret)};

    const client = new ApolloClient({
        typeDefs: typeDefs,
        link: new HttpLink(linkOptions),
        cache: new InMemoryCache({addTypename: true}),
        resolvers: {}
    });

    const variables = mapModelStringToQueryVariableArray(vars ?? '') ?? [];
    const variablesMap: { [key: string]: string } = {};

    variables.forEach((variable) => variablesMap[variable.name] = variable.value);

    let mutation_type_name = '';

    switch (type) {
        case mutationType.Create:
            mutation_type_name = 'insert_' + table;
            break;
        case mutationType.Update:
            mutation_type_name = 'update_' + table;
            break;
        case mutationType.Delete:
            mutation_type_name = 'delete_' + table;
            break;
    }

    try {
        await client.mutate({
            mutation: gql`${mutation}`,
            variables: variablesMap,
            fetchPolicy: 'no-cache'
        }).then(response => {
            queryData = response.data[mutation_type_name]['affected_rows'];
        }).catch(err => {
            isSuccessful = false;
            queryError = err;
        })
    } catch (e) {
        isSuccessful = false;

        if (typeof e === "string") {
            queryError = e;
        } else if (e instanceof Error) {
            queryError = e.message;
        }
    }

    return {isSuccessful: isSuccessful, data: queryData, error: queryError};
}

/**
 * Generates an executable version of a graphQL query.
 * @param queryName Name of the query
 * @param table Name of the table that the query should be run on
 * @param fields List of fields that the query should get as a response (fields separated with ';')
 * @param where Where condition (list of where condition parts {@link QueryWhere}).
 * The order of array elements is significant for proper parts connection using '_and' and '_or' operators
 * @param orderBy List of order by items (list of order by parts {@link QueryOrderBy})
 * @param limit Limit of the query result set
 * @param vars Variables to be used with the query (list of order by condition parts {@link QueryOrderBy})
 * @param pageNum Optional parameter used for pagination, returns a single page of data
 * @param pageSize Optional parameter used for pagination responible for the return data page size
 * @returns A string representation of a graphQL query.
 **/
export const generateGraphQLQuery = (queryName: string, table: string, fields: string, where?: QueryWhere[],
                                     orderBy?: QueryOrderBy[], limit?: number, vars?: QueryVariable[],
                                     pageNum?: number, pageSize?: number): string => {
    if (!table.length) {
        return '';
    }

    const whereSet = where != undefined && where.length;
    const orderBySet = orderBy != undefined && orderBy.length;
    const limitSet = limit != undefined && limit > 0;
    const varsSet = vars != undefined && vars.length;
    const offsetSet = pageNum != undefined && pageSize != undefined;

    const cleanName = queryName
        .replaceAll(/[^a-zA-Z ]/g, '')
        .replaceAll(' ', '');

    const emptyVars = (vars ?? [])
        .filter((variable) => !variable.value)
        .map((variable) => variable.name);

    let filteredWhere = [];
    let filteredWhereVarNames = [''];
    let generatedWhere = '';

    if (whereSet) {
        filteredWhere = [...where].filter((part) => part.required || !emptyVars.includes(part.variable));
        filteredWhereVarNames = filteredWhere.map((part) => part.variable.toString());
        generatedWhere = generateGraphQLWhere(filteredWhere);
    }

    let query = `query ${cleanName} `;

    const filteredVars = vars?.filter((variable) => filteredWhereVarNames.includes(variable.name)) ?? [];

    if (varsSet && filteredVars.length) query += '(';

    filteredVars.forEach((el, index) => {
        query += `$${el.name}: ${el.type}`;
        query += index + 1 !== filteredVars?.length ? ', ' : ') ';
    });

    query += `{\n\t${table} `;

    if (limitSet || orderBySet || whereSet || offsetSet) query += '(';

    if (offsetSet) {
        if (limitSet || orderBySet || whereSet) query += ', ';
        query += `limit: ${pageSize}, offset: ${pageNum * pageSize}`;
    } else if (limitSet) {
        query += `limit: ${limit}`;
    }

    if (orderBySet) {
        if (query.includes('limit:')) query += ', ';
        query += 'order_by: {';
        query += generateGraphQLOrderBy([...orderBy ?? []], 1);
        query += '}';
    }

    if (whereSet) {
        if (generatedWhere.length) {
            if (limitSet || orderBySet) query += ', ';
            query += `where: ${generatedWhere}`;
        }
    }

    if (limitSet || orderBySet || whereSet || offsetSet) query += ') ';

    query += `{`;
    query += generateGraphQLFields(fields?.split(';') ?? [], 1);
    query += `\n\t}\n}`;

    return query;
}

/**
 * Generates a preview version of a graphQL query.
 * @param queryName Name of the query
 * @param table Name of the table that the query should be run on
 * @param fields List of fields that the query should get as a response (fields separated with ';')
 * @param where Where condition (list of where condition parts {@link QueryWhere}).
 * The order of array elements is significant for proper parts connection using '_and' and '_or' operators
 * @param orderBy List of order by items (list of order by parts {@link QueryOrderBy})
 * @param limit Limit of the query result set
 * @param vars Variables to be used with the query (list of order by condition parts {@link QueryOrderBy})
 * @returns A html preview representation of a graphQL query.
 **/
export const generateGraphQLPreviewQuery = (queryName: string, table: string, fields: string, where?: QueryWhere[],
                                            orderBy?: QueryOrderBy[], limit?: number, vars?: QueryVariable[]): string => {
    if (!table.length) {
        return '';
    }

    const whereSet = where != undefined && where.length;
    const orderBySet = orderBy != undefined && orderBy.length;
    const limitSet = limit != undefined;
    const varsSet = vars != undefined && vars.length;

    const cleanName = queryName
        .replaceAll(/[^a-zA-Z ]/g, '')
        .replaceAll(' ', '');

    let query = `<span style="color:brown">query</span> <span style="color:red">${cleanName} </span>`;

    if (varsSet) query += '(';

    vars?.forEach((el, index) => {
        query += `<span style="color:green">$${el.name}</span>: <span style="color:darkgoldenrod">${el.type}</span>`;
        query += index + 1 !== vars?.length ? ', ' : ') ';
    });

    query += `{<br/>&emsp;<span style="color:royalblue">${table}</span> `;

    if (limitSet || orderBySet || whereSet) query += '(';

    if (limitSet) {
        query += `<br/>&emsp;&emsp;<span style="color:purple">limit</span>: `;
        query += `<span style="color:royalblue">${limit}</span>`;
    }

    if (orderBySet) {
        if (limitSet) query += ', ';
        query += '<br/>&emsp;&emsp;<span style="color:purple">order_by</span>: {';
        query += generateGraphQLPreviewOrderBy([...orderBy ?? []], 1);
        query += '}';
    }

    if (whereSet) {
        if (limitSet || orderBySet) query += ', ';
        query += `<br/>&emsp;&emsp;<span style="color:purple">where</span>: `;
        query += generateGraphQLPreviewWhere(where);
    }

    if (limitSet || orderBySet || whereSet) query += '<br/>&emsp;) ';

    query += `{`;
    query += generateGraphQLPreviewFields(fields?.split(';') ?? [], 1);
    query += `<br/>&emsp;}<br/>}`;

    return query;
}

/**
 * Generates an executable version of a graphQL mutation.
 * @param mutationName Name of the mutation
 * @param table Name of the table that the mutation should be run on
 * @param type Type of the mutation (Create, Update, Delete {@link mutationType})
 * @param fields List of fields that the mutation should use (fields separated with ';')
 * @param where Where condition (list of where condition parts {@link QueryWhere}).
 * The order of array elements is significant for proper parts connection using '_and' and '_or' operators
 * @param vars Variables to be used with the mutation (list of order by condition parts {@link QueryOrderBy})
 * @returns A string representation of a graphQL mutation.
 **/
export const generateGraphQLMutation = (mutationName: string, table: string, type: mutationType,
                                        fields: QuerySetValue[], where?: QueryWhere[],
                                        vars?: QueryVariable[]): string => {
    if (!table.length) {
        return '';
    }

    const whereSet = where != undefined && where.length;
    const varsSet = vars != undefined && vars.length;

    const cleanName = mutationName
        .replaceAll(/[^a-zA-Z ]/g, '')
        .replaceAll(' ', '');

    let mutation = `mutation ${cleanName} `;

    if (varsSet) mutation += '(';

    vars?.forEach((el, index) => {
        mutation += `$${el.name}: ${el.type}`;
        mutation += index + 1 !== vars?.length ? ', ' : ') ';
    })

    let mutation_type_name = '';

    switch (type) {
        case mutationType.Create:
            mutation_type_name = 'insert_' + table;
            break;
        case mutationType.Update:
            mutation_type_name = 'update_' + table;
            break;
        case mutationType.Delete:
            mutation_type_name = 'delete_' + table;
            break;
    }

    mutation += `{\n\t${mutation_type_name} `;

    if (type == mutationType.Create && fields.length) {
        mutation += `(objects: {`;
        mutation += generateGraphQLSetValues(fields);
        mutation += '\n\t})';
    }

    if (type == mutationType.Delete && whereSet) {
        mutation += `(\n\t\twhere: `;
        mutation += generateGraphQLWhere(where);
        mutation += '\n\t)';
    }

    if (type == mutationType.Update) {
        mutation += `(_set: {`;

        if (fields.length) {
            mutation += generateGraphQLSetValues(fields);
        }

        mutation += '\n\t}';
        mutation += `, where: `;

        if (whereSet) {
            mutation += generateGraphQLWhere(where);
        }

        mutation += ')';
    }

    mutation += ` {\n`;
    mutation += `\t\taffected_rows`;
    mutation += `\n\t}\n}`;

    return mutation;
}

/**
 * Generates a preview version of a graphQL mutation.
 * @param mutationName Name of the mutation
 * @param table Name of the table that the mutation should be run on
 * @param type Type of the mutation (Create, Update, Delete {@link mutationType})
 * @param fields List of fields that the mutation should use (fields separated with ';')
 * @param where Where condition (list of where condition parts {@link QueryWhere}).
 * The order of array elements is significant for proper parts connection using '_and' and '_or' operators
 * @param vars Variables to be used with the mutation (list of order by condition parts {@link QueryOrderBy})
 * @returns A html preview representation of a graphQL mutation.
 **/
export const generateGraphQLPreviewMutation = (mutationName: string, table: string, type: mutationType,
                                               fields: QuerySetValue[], where?: QueryWhere[],
                                               vars?: QueryVariable[]): string => {
    if (!table.length) {
        return '';
    }

    const whereSet = where != undefined && where.length;
    const varsSet = vars != undefined && vars.length;

    const cleanName = mutationName
        .replaceAll(/[^a-zA-Z ]/g, '')
        .replaceAll(' ', '');

    let mutation = `<span style="color:brown">mutation</span> <span style="color:red">${cleanName} </span>`;

    if (varsSet) mutation += '(';

    vars?.forEach((el, index) => {
        mutation += `<span style="color:green">$${el.name}</span>: <span style="color:darkgoldenrod">${el.type}</span>`;
        mutation += index + 1 !== vars?.length ? ', ' : ') ';
    });

    let mutation_type_name = '';

    switch (type) {
        case mutationType.Create:
            mutation_type_name = 'insert_' + table;
            break;
        case mutationType.Update:
            mutation_type_name = 'update_' + table;
            break;
        case mutationType.Delete:
            mutation_type_name = 'delete_' + table;
            break;
    }

    mutation += `{<br/>&emsp;<span style="color:royalblue">${mutation_type_name}</span> `;

    if (type == mutationType.Create && fields.length) {
        mutation += `(<span style="color:purple">objects</span>: {`;
        mutation += generateGraphQLPreviewSetValues(fields);
        mutation += '<br/>&emsp;})';
    }

    if (type == mutationType.Delete && whereSet) {
        mutation += `(<br/>&emsp;&emsp;<span style="color:purple">where</span>: `;
        mutation += generateGraphQLPreviewWhere(where);
        mutation += '<br/>&emsp;)';
    }

    if (type == mutationType.Update) {
        mutation += `(<span style="color:purple">_set</span>: {`;

        if (fields.length) {
            mutation += generateGraphQLPreviewSetValues(fields);
        }

        mutation += '<br/>&emsp;}';
        mutation += `, <span style="color:purple">where</span>: `;

        if (whereSet) {
            mutation += generateGraphQLPreviewWhere(where);
        }

        mutation += ')';
    }

    mutation += ` {<br/>`;
    mutation += `&emsp;&emsp;<span style="color:royalblue">affected_rows</span>`;
    mutation += `<br/>&emsp;}<br/>}`;

    return mutation;
}

/**
 * Generates a preview version of a graphQL query variables.
 * @param vars Variables to be used with the query (list of order by condition parts {@link QueryOrderBy})
 * @returns A html preview representation of a graphQL query variables.
 **/
export const generateGraphQLPreviewVariables = (vars?: QueryVariable[]) => {
    let variables = '{<br/>';

    vars?.forEach((variable, index) => {
        variables += `<span style="color:green">"${variable.name}"</span>: `;

        switch (variable.type) {
            case 'String':
                variables += `<span style="color:deeppink">"${variable.value}"</span>`;
                break;
            case 'Int':
            case 'float8':
            case 'bigint':
                variables += `<span style="color:royalblue">${variable.value}</span>`;
                break;
            case 'Boolean':
                variables += `<span style="color:goldenrod">${variable.value}</span>`;
                break;
            default:
                variables += `<span style="color:deeppink">"${variable.value}"</span>`;
                break;
        }

        if (index + 1 === vars.length) {
            variables += '<br/>';
        } else {
            variables += ',<br/>';
        }
    })

    variables += '}';

    return variables;
}

export const mapModelStringToQueryOrderByArray = (values: string): QueryOrderBy[] => {
    const objectParts: QueryOrderBy[] = [];

    if (values.length) {
        values.replaceAll(' ', '')
            .split(';')
            .forEach((value) => objectParts.push(JSON.parse(value)));
    }

    return objectParts
}

export const mapModelStringToQueryVariableArray = (values: string): QueryVariable[] => {
    const objectParts: QueryVariable[] = [];

    if (values.length) {
        values.split(';').forEach((value) => objectParts.push(JSON.parse(value)));
    }

    return objectParts;
}

export const mapModelStringToQueryWhereArray = (values: string): QueryWhere[] => {
    const objectParts: QueryWhere[] = [];

    if (values.length) {
        values.replaceAll(' ', '')
            .split(';')
            .forEach((value) => objectParts.push(JSON.parse(value)));
    }

    return objectParts;
}

export const mapModelStringToQuerySetValueArray = (values: string): QuerySetValue[] => {
    const objectParts: QuerySetValue[] = [];

    if (values.length) {
        values.replaceAll(' ', '')
            .split(';')
            .forEach((value) => objectParts.push(JSON.parse(value)));
    }

    return objectParts;
}

const createQueryHeaders = (datasourceSecret?: string) => {
    const headers = {'authorization': '', 'content-type': '', 'x-hasura-admin-secret': ''};
    const token = window.localStorage.getItem('apollo-token');
    if (token) headers.authorization = `Bearer ${token}`;
    headers['content-type'] = 'application/json';
    headers['x-hasura-admin-secret'] = datasourceSecret ?? '';
    return headers;
}

const generateGraphQLWhere = (where: QueryWhere[]): string => {
    let graphQLWhere = '';
    let currentIsAnd: boolean | null = null;
    let differentOperationsCount = 0;

    where.forEach((part, index) => {
        if (currentIsAnd != null) graphQLWhere += ', ';

        if (where.length !== index + 1) {
            const nextPart = where[index + 1];

            if (nextPart.isAnd && (currentIsAnd == null || !currentIsAnd)) {
                differentOperationsCount++;
                currentIsAnd = true;
                graphQLWhere += '{_and: [';
            }

            if (!nextPart.isAnd && (currentIsAnd == null || currentIsAnd)) {
                differentOperationsCount++;
                currentIsAnd = false;
                graphQLWhere += '{_or: [';
            }
        }

        graphQLWhere += `{${part.field}: {${operatorTypes.get(part.operator)}: $${part.variable}}}`;
    })

    for (let _i = 0; _i < differentOperationsCount; _i++) {
        graphQLWhere += ']}';
    }

    return graphQLWhere;
}

const generateGraphQLPreviewWhere = (where: QueryWhere[]): string => {
    let graphQLWhere = '';
    let currentIsAnd: boolean | null = null;
    let differentOperationsCount = 0;

    where = where.filter((wherePart) => !wherePart.field.includes('.'));

    where.forEach((part, index) => {
        if (currentIsAnd != null) graphQLWhere += ', ';

        if (where.length !== index + 1) {
            const nextPart = where[index + 1];

            if (nextPart.isAnd && (currentIsAnd == null || !currentIsAnd)) {
                differentOperationsCount++;
                currentIsAnd = true;
                graphQLWhere += '{<span style="color:purple">_and</span>: [';
            }

            if (!nextPart.isAnd && (currentIsAnd == null || currentIsAnd)) {
                differentOperationsCount++;
                currentIsAnd = false;
                graphQLWhere += '{<span style="color:purple">_or</span>: [';
            }
        }

        graphQLWhere += `{<span style="color:purple">${part.field}</span>: `;
        graphQLWhere += `<span style="color:purple">{${operatorTypes.get(part.operator)}</span>: `;
        graphQLWhere += `<span style="color:green">$${part.variable}</span>}}`;
    })

    for (let _i = 0; _i < differentOperationsCount; _i++) {
        graphQLWhere += ']}';
    }

    return graphQLWhere;
}

const generateGraphQLFields = (fields: string[], level: number) => {
    let result = '';

    if (!fields.length) {
        return '';
    }

    let newRowIndent = '\n\t\t';

    for (let i = 0; i < level; i++) {
        newRowIndent += '\t';
    }

    fields.forEach((field) => {
        if (!field.includes('.')) {
            result += `${newRowIndent}${field}`;
        }
    });

    const relations = new Map<string, string[]>();

    fields.forEach((field) => {
        if (field.includes('.')) {
            const relationName = field.substring(0, field.indexOf('.'));
            const relationFields = relations.get(relationName) ?? [];

            relations.set(relationName, [...relationFields, field.substring(field.indexOf('.') + 1)]);
        }
    })

    relations.forEach((value: string[], key: string) => {
        result += `${newRowIndent}${key} {`;
        result += generateGraphQLFields(value, level + 1);
        result += `${newRowIndent}}`;
    })

    return result;
}

const generateGraphQLPreviewFields = (fields: string[], level: number) => {
    let result = '';

    if (!fields.length) {
        return '';
    }

    let newRowIndent = '<br/>&emsp;&emsp;';

    for (let i = 0; i < level; i++) {
        newRowIndent += '&emsp;';
    }

    fields.forEach((field) => {
        if (!field.includes('.')) {
            result += `${newRowIndent}<span style="color:royalblue">${field}</span>`;
        }
    });

    const relations = new Map<string, string[]>();

    fields.forEach((field) => {
        if (field.includes('.')) {
            const relationName = field.substring(0, field.indexOf('.'));
            const relationFields = relations.get(relationName) ?? [];

            relations.set(relationName, [...relationFields, field.substring(field.indexOf('.') + 1)]);
        }
    })

    relations.forEach((value: string[], key: string) => {
        result += `${newRowIndent}<span style="color:royalblue">${key}</span> {`;
        result += generateGraphQLPreviewFields(value, level + 1);
        result += `${newRowIndent}}`;
    })

    return result;
}

const generateGraphQLOrderBy = (orderBy: QueryOrderBy[], level: number) => {
    let result = '';

    if (!orderBy.length) {
        return '';
    }

    orderBy.forEach((order, index) => {
        if (!order.field.includes('.')) {
            result += `${order.field}: `;
            result += `${order.isAsc ? 'asc' : 'desc'}`;
            result += index !== orderBy?.length ? ', ' : '';
        }
    });

    const relations = new Map<string, QueryOrderBy[]>();

    orderBy.forEach((order) => {
        if (order.field.includes('.')) {
            const relationName = order.field.substring(0, order.field.indexOf('.'));
            const relationFields = relations.get(relationName) ?? [];

            order.field = order.field.substring(order.field.indexOf('.') + 1);

            relations.set(relationName, [...relationFields, order]);
        }
    })

    relations.forEach((value: QueryOrderBy[], key: string) => {
        result += ` ${key}: {`;
        result += generateGraphQLOrderBy(value, level + 1);
        result += `}`;
    })

    return result;
}

const generateGraphQLPreviewOrderBy = (orderBy: QueryOrderBy[], level: number) => {
    let result = '';

    if (!orderBy.length) {
        return '';
    }

    orderBy.forEach((order, index) => {
        if (!order.field.includes('.')) {
            result += `<span style="color:purple">${order.field}</span>: `;
            result += `<span style="color:royalblue">${order.isAsc ? 'asc' : 'desc'}</span>`;
            result += index !== orderBy?.length ? ', ' : '';
        }
    });

    const relations = new Map<string, QueryOrderBy[]>();

    orderBy.forEach((order) => {
        if (order.field.includes('.')) {
            const relationName = order.field.substring(0, order.field.indexOf('.'));
            const relationFields = relations.get(relationName) ?? [];

            order.field = order.field.substring(order.field.indexOf('.') + 1);

            relations.set(relationName, [...relationFields, order]);
        }
    });

    relations.forEach((value: QueryOrderBy[], key: string) => {
        result += ` <span style="color:royalblue">${key}</span>: {`;
        result += generateGraphQLPreviewOrderBy(value, level + 1);
        result += `}`;
    })

    return result;
}

const generateGraphQLSetValues = (fields: QuerySetValue[]) => {
    let result = '';

    if (!fields.length) {
        return '';
    }

    fields.forEach((field) => {
        if (!field.name.includes('.') && field.variable !== fieldAutoVar) {
            result += `\n\t\t${field.name}: `;

            if (field.variable.length) {
                result += `$${field.variable}`;
            }
        }
    })

    return result;
}

const generateGraphQLPreviewSetValues = (fields: QuerySetValue[]) => {
    let result = '';

    if (!fields.length) {
        return '';
    }

    fields.forEach((field) => {
        if (!field.name.includes('.') && field.variable !== fieldAutoVar) {
            result += `<br/>&emsp;&emsp;<span style="color:purple">${field.name}</span>: `;

            if (field.variable.length) {
                result += `<span style="color:green">$${field.variable}</span>`;
            }
        }
    })

    return result;
}