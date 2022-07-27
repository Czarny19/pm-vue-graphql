import {QueryVariable, QueryWherePart} from "@/plugins/types";

export const operatorTypes = new Map<string, string>([['=', '_eq'], ['!=', '_neq'], ['>', '_gt'],
    ['>=', '_gte'], ['<', '_lt'], ['<=', '_lte'], ['=null', '_is_null'], ['%', '_like'], ['!%', '_nlike']])

export const numberOperators = ['=', '!=', '>', '>=', '<', '<=', '=null']

export const stringOperators = ['=', '!=', '%', '!%', '=null']

export const generateQuery = (queryName: string, tableName: string, fields?: string, where?: string, orderBy?: string,
                              limit?: number, variables?: QueryVariable[]) => {

    if (tableName == null || tableName.length == 0) {
        return '';
    }

    const cleanName = queryName.replace(/[^a-zA-Z ]/g, '').replaceAll(' ', '')

    let query = `query ${cleanName} `

    if (variables != undefined && variables.length > 0) {
        query += '('
    }

    variables?.forEach((variable, index) => {
        query += `$${variable.name}: ${variable.type}`

        if (index + 1 !== variables?.length) {
            query += ', '
        } else {
            query += ') '
        }
    })

    query += `{\n\t${tableName} `

    if (limit != null) {
        query += `(limit: ${limit}`
    }

    if (orderBy != null) {
        if (query.includes('(')) {
            query += `, order_by: {${orderBy}`
        } else {
            query += `(order_by: {${orderBy}`
        }
    }

    if (where != null) {
        if (query.includes('(')) {
            query += `, where: ${where}`
        } else {
            query += `(where: ${where}`
        }
    }

    if (query.includes('(')) {
        query += ') '
    }

    query += `{\n\t\t${fields?.split(',').join('\n\t\t')}\n\t}\n}`

    return query
}

export const generateVariablesPreview = (variables: QueryVariable []) => {
    let query = '{\n'

    variables.forEach((variable, index) => {
        query += `\t"${variable.name}": `

        if (variable.type === 'String') {
            query += `"${variable.value}"`
        } else {
            query += `${variable.value}`
        }

        if (index + 1 === variables.length) {
            query += '\n'
        } else {
            query += ',\n'
        }
    })

    query += '}'

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