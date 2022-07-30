import {QueryOrderBy, QueryResult, QueryVariable, QueryWhere} from "@/lib/types";
import ApolloClient from "apollo-client";
import {typeDefs} from "@/graphql/typedefs";
import {HttpLink} from "apollo-link-http";
import {InMemoryCache} from "apollo-cache-inmemory";
import gql from "graphql-tag";

export const operatorTypes = new Map<string, string>([['=', '_eq'], ['!=', '_neq'], ['>', '_gt'],
    ['>=', '_gte'], ['<', '_lt'], ['<=', '_lte'], ['=null', '_is_null'], ['%', '_like'], ['!%', '_nlike']])

export const numberOperators = ['=', '!=', '>', '>=', '<', '<=', '=null']

export const stringOperators = ['=', '!=', '%', '!%', '=null']

/**
 * Runs a graphQL query on an existing table.
 * @param endpoint Address of and existing graphQL endpoint
 * @param query Query to run (can be generated using {@link generateGraphQLQuery})
 * @param table Name of the table that the query should be run on
 * @param secret GraphQL endpoint secret (null if the endpoint is not secured)
 * @param vars Variables to be used with the query, separated with ';' (null if there are no query variables)
 * @returns Promise containing an object with the query result of type {@link QueryResult}.
 **/
export const runQuery = async (endpoint: string, query: string, table: string, secret?: string,
                               vars?: string): Promise<QueryResult> => {
    let isSuccessful = true
    let queryData: unknown[] = []
    let queryError = ''

    const linkOptions = {uri: endpoint, headers: createQueryHeaders(secret)}

    const client = new ApolloClient({
        typeDefs: typeDefs,
        link: new HttpLink(linkOptions),
        cache: new InMemoryCache({addTypename: true}),
        resolvers: {}
    })

    const variables = mapModelStringToQueryVariableArray(vars ?? '') ?? []
    const variablesMap: { [key: string]: string } = {}

    variables.forEach((variable) => variablesMap[variable.name] = variable.value)

    try {
        await client.query({
            query: gql`${query}`,
            variables: variablesMap,
            fetchPolicy: 'network-only'
        }).then(response => {
            queryData = response.data[table]
        }).catch(err => {
            isSuccessful = false
            queryError = err
        })
    } catch (e) {
        isSuccessful = false

        if (typeof e === "string") {
            queryError = e
        } else if (e instanceof Error) {
            queryError = e.message
        }
    }

    return {isSuccessful: isSuccessful, data: queryData, error: queryError}
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
 * @returns A string representation of a graphQL query.
 **/
export const generateGraphQLQuery = (queryName: string, table: string, fields: string, where?: QueryWhere[],
                                     orderBy?: QueryOrderBy[], limit?: number, vars?: QueryVariable[]): string => {
    if (!table.length) {
        return '';
    }

    const whereSet = where != undefined && where.length
    const orderBySet = orderBy != undefined && orderBy.length
    const limitSet = limit != undefined
    const varsSet = vars != undefined && vars.length

    const cleanName = queryName
        .replaceAll(/[^a-zA-Z ]/g, '')
        .replaceAll(' ', '')

    let query = `query ${cleanName} `

    if (varsSet) query += '('

    vars?.forEach((el, index) => {
        query += `$${el.name}: ${el.type}`
        query += index + 1 !== vars?.length ? ', ' : ') '
    })

    query += `{\n\t${table} `

    if (limitSet || orderBySet || whereSet) query += '('

    if (limitSet) query += `limit: ${limit}`

    if (orderBySet) {
        if (query.includes('limit:')) query += ', '
        query += 'order_by: {'
    }

    orderBy?.forEach((el, index) => {
        query += `${el.field}: ${el.isAsc ? 'asc' : 'desc'}`
        query += index + 1 !== orderBy?.length ? ', ' : '}'
    })

    if (whereSet) {
        if (limitSet || orderBySet) query += ', '
        query += `where: ${generateGraphQLWhere(where)}`
    }

    if (limitSet || orderBySet || whereSet) query += ') '

    query += `{\n\t\t${fields?.split(';').join('\n\t\t')}\n\t}\n}`

    return query
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

    const whereSet = where != undefined && where.length
    const orderBySet = orderBy != undefined && orderBy.length
    const limitSet = limit != undefined
    const varsSet = vars != undefined && vars.length

    const cleanName = queryName
        .replaceAll(/[^a-zA-Z ]/g, '')
        .replaceAll(' ', '')

    let query = `<span style="color:brown">query</span> <span style="color:red">${cleanName} </span>`

    if (varsSet) query += '('

    vars?.forEach((el, index) => {
        query += `<span style="color:green">$${el.name}</span>: <span style="color:darkgoldenrod">${el.type}</span>`
        query += index + 1 !== vars?.length ? ', ' : ') '
    })

    query += `{<br/>&emsp;<span style="color:royalblue">${table}</span> `

    if (limitSet || orderBySet || whereSet) query += '('

    if (limitSet) {
        query += `<br/>&emsp;&emsp;<span style="color:purple">limit</span>: `
        query += `<span style="color:royalblue">${limit}</span>`
    }

    if (orderBySet) {
        if (limitSet) query += ', '
        query += '<br/>&emsp;&emsp;<span style="color:purple">order_by</span>: {'
    }

    orderBy?.forEach((el, index) => {
        query += `<span style="color:purple">${el.field}</span>: `
        query += `<span style="color:royalblue">${el.isAsc ? 'asc' : 'desc'}</span>`
        query += index + 1 !== orderBy?.length ? ', ' : '}'
    })

    if (whereSet) {
        if (limitSet || orderBySet) query += ', '
        query += `<br/>&emsp;&emsp;<span style="color:purple">where</span>: `
        query += generateGraphQLPreviewWhere(where)
    }

    if (limitSet || orderBySet || whereSet) query += ') '

    query += `{<br/>&emsp;&emsp;&emsp;`
    query += `<span style="color:royalblue">${fields?.split(';').join('<br/>&emsp;&emsp;&emsp;')}</span>`
    query += `<br/>&emsp;}<br/>}`

    return query
}

/**
 * Generates a preview version of a graphQL query variables.
 * @param vars Variables to be used with the query (list of order by condition parts {@link QueryOrderBy})
 * @returns A html preview representation of a graphQL query variables.
 **/
export const generateGraphQLPreviewVariables = (vars?: QueryVariable[]) => {
    let variables = '{<br/>'

    vars?.forEach((variable, index) => {
        variables += `<span style="color:green">"${variable.name}"</span>: `

        if (variable.type === 'String') {
            variables += `<span style="color:deeppink">"${variable.value}"</span>`
        } else {
            variables += `<span style="color:royalblue">${variable.value}</span>`
        }

        if (index + 1 === vars.length) {
            variables += '<br/>'
        } else {
            variables += ',<br/>'
        }
    })

    variables += '}'

    return variables
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
        values.replaceAll(' ', '')
            .split(';')
            .forEach((value) => objectParts.push(JSON.parse(value)));
    }

    return objectParts
}

export const mapModelStringToQueryWhereArray = (values: string): QueryWhere[] => {
    const objectParts: QueryWhere[] = [];

    if (values.length) {
        values.replaceAll(' ', '')
            .split(';')
            .forEach((value) => objectParts.push(JSON.parse(value)));
    }

    return objectParts
}

const createQueryHeaders = (datasourceSecret?: string) => {
    const headers = {'authorization': '', 'content-type': '', 'x-hasura-admin-secret': ''}
    const token = window.localStorage.getItem('apollo-token')
    if (token) headers.authorization = `Bearer ${token}`
    headers['content-type'] = 'application/json'
    headers['x-hasura-admin-secret'] = datasourceSecret ?? ''
    return headers
}

const generateGraphQLWhere = (where: QueryWhere[]) => {
    let graphQLWhere = ''
    let currentIsAnd: boolean | null = null
    let differentOperationsCount = 0;

    where.forEach((part, index) => {
        if (currentIsAnd != null) graphQLWhere += ', '

        if (where.length !== index + 1) {
            const nextPart = where[index + 1]

            if (nextPart.isAnd && (currentIsAnd == null || !currentIsAnd)) {
                differentOperationsCount++;
                currentIsAnd = true
                graphQLWhere += '{_and: ['
            }

            if (!nextPart.isAnd && (currentIsAnd == null || currentIsAnd)) {
                differentOperationsCount++;
                currentIsAnd = false
                graphQLWhere += '{_or: ['
            }
        }

        graphQLWhere += `{${part.field}: {${operatorTypes.get(part.operator)}: $${part.variable}}}`
    })

    for (let _i = 0; _i < differentOperationsCount; _i++) {
        graphQLWhere += ']}'
    }

    return graphQLWhere
}

const generateGraphQLPreviewWhere = (where: QueryWhere[]) => {
    let graphQLWhere = ''
    let currentIsAnd: boolean | null = null
    let differentOperationsCount = 0;

    where.forEach((part, index) => {
        if (currentIsAnd != null) graphQLWhere += ', '

        if (where.length !== index + 1) {
            const nextPart = where[index + 1]

            if (nextPart.isAnd && (currentIsAnd == null || !currentIsAnd)) {
                differentOperationsCount++;
                currentIsAnd = true
                graphQLWhere += '{<span style="color:purple">_and</span>: ['
            }

            if (!nextPart.isAnd && (currentIsAnd == null || currentIsAnd)) {
                differentOperationsCount++;
                currentIsAnd = false
                graphQLWhere += '{<span style="color:purple">_or</span>: ['
            }
        }

        graphQLWhere += `{<span style="color:purple">${part.field}</span>: `
        graphQLWhere += `<span style="color:purple">{${operatorTypes.get(part.operator)}</span>: `
        graphQLWhere += `<span style="color:green">$${part.variable}</span>}}`
    })

    for (let _i = 0; _i < differentOperationsCount; _i++) {
        graphQLWhere += ']}'
    }

    return graphQLWhere
}