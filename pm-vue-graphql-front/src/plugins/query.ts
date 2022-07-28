import {QueryOrderBy, QueryVariable, QueryWherePart} from "@/plugins/types";

export const operatorTypes = new Map<string, string>([['=', '_eq'], ['!=', '_neq'], ['>', '_gt'],
    ['>=', '_gte'], ['<', '_lt'], ['<=', '_lte'], ['=null', '_is_null'], ['%', '_like'], ['!%', '_nlike']])

export const numberOperators = ['=', '!=', '>', '>=', '<', '<=', '=null']

export const stringOperators = ['=', '!=', '%', '!%', '=null']

export const generateQuery = (queryName: string, tableName: string, fields?: string, where?: string, orderBy?: string,
                              limit?: number, variables?: string) => {

    if (tableName == null || tableName.length == 0) {
        return '';
    }

    const cleanName = queryName.replace(/[^a-zA-Z ]/g, '').replaceAll(' ', '')

    let query = `query ${cleanName} `

    if (variables != undefined && variables.length > 0) {
        query += '('
    }

    const varsList = mapVariablesStringToObject(variables ?? '')
    const orderByList = mapOrderByStringToObject(orderBy ?? '')
    const whereList = mapWhereStringToObject(where ?? '')

    varsList?.forEach((variable, index) => {
        query += `$${variable.name}: ${variable.type}`

        if (index + 1 !== varsList?.length) {
            query += ', '
        } else {
            query += ') '
        }
    })

    query += `{\n\t${tableName} `

    if (limit != null || (orderBy != undefined && orderBy.length > 0) || (where != undefined && where.length > 0)) {
        query += '('
    }

    if (limit != null) {
        query += `limit: ${limit}`
    }

    if (orderBy != undefined && orderBy.length > 0) {
        if (query.includes('limit:')) {
            query += ', '
        }

        query += 'order_by: {'
    }

    orderByList?.forEach((orderBy, index) => {
        query += `${orderBy.field}: ${orderBy.isAsc ? 'asc' : 'desc'}`

        if (index + 1 !== orderByList?.length) {
            query += ', '
        } else {
            query += '}'
        }
    })

    if (where != undefined && where.length > 0) {
        if (query.includes('limit:') || query.includes('order_by:')) {
            query += ', '
        }

        query += `where: ${generateWhere(whereList)}`
    }

    if (limit != null || (orderBy != undefined && orderBy.length > 0) || (where != undefined && where.length > 0)) {
        query += ') '
    }

    query += `{\n\t\t${fields?.split(',').join('\n\t\t')}\n\t}\n}`

    return query
}

export const generateWhere = (parts: QueryWherePart[]) => {
    let where = ''
    let currentIsAnd: boolean | null = null
    let differentOperationsCount = 0;

    parts.forEach((part, index) => {
        if (currentIsAnd != null) {
            where += ', '
        }

        if (parts.length !== index + 1) {
            const nextPart = parts[index + 1]

            if (nextPart.isAnd && (currentIsAnd == null || !currentIsAnd)) {
                differentOperationsCount++;
                currentIsAnd = true
                where += '{_and: ['
            }

            if (!nextPart.isAnd && (currentIsAnd == null || currentIsAnd)) {
                differentOperationsCount++;
                currentIsAnd = false
                where += '{_or: ['
            }
        }

        where += `{${part.field} : {${operatorTypes.get(part.operator)}: $${part.variable}}}`
    })

    for (let _i = 0; _i < differentOperationsCount; _i++) {
        where += ']}'
    }

    return where
}

export const generateVariablesPreview = (variables: string) => {
    const vars = mapVariablesStringToObject(variables)

    let query = '{\n'

    vars?.forEach((variable, index) => {
        query += `\t"${variable.name}": `

        if (variable.type === 'String') {
            query += `"${variable.value}"`
        } else {
            query += `${variable.value}`
        }

        if (index + 1 === vars.length) {
            query += '\n'
        } else {
            query += ',\n'
        }
    })

    query += '}'

    return query
}

export const mapOrderByStringToObject = (values: string) => {
    const objectParts: QueryOrderBy[] = [];

    if (values.length) {
        values.replaceAll(' ', '')
            .split(';')
            .forEach((value) => objectParts.push(JSON.parse(value)));
    }

    return objectParts
}

export const mapVariablesStringToObject = (values: string) => {
    const objectParts: QueryVariable[] = [];

    if (values.length) {
        values.replaceAll(' ', '')
            .split(';')
            .forEach((value) => objectParts.push(JSON.parse(value)));
    }

    return objectParts
}

export const mapWhereStringToObject = (values: string) => {
    const objectParts: QueryWherePart[] = [];

    if (values.length) {
        values.replaceAll(' ', '')
            .split(';')
            .forEach((value) => objectParts.push(JSON.parse(value)));
    }

    return objectParts
}