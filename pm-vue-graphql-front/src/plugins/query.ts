import {QueryVariable} from "@/plugins/types";

export const generateQuery = (queryName: string, tableName: string, fields?: string, orderBy?: string, limit?: number) => {
    if (tableName == null || tableName.length == 0) {
        return '';
    }

    const cleanName = queryName.replace(/[^a-zA-Z ]/g, '').replaceAll(' ', '')

    let query = `query ${cleanName} {`
    query += `\n\t${tableName} `

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

    if (query.includes('(')) {
        query += ') '
    }

    query += `{\n\t\t${fields?.split(',').join('\n\t\t')}\n\t}\n}`

    return query
}

export const generateVariablesPreview = (variables: QueryVariable []) => {
    let query = '{\n'

    variables.forEach((variable) => {
        query += `\t"${variable.name}": `

        if (variable.type === 'String') {
            query += `"${variable.value}"\n`
        } else {
            query += `${variable.value}\n`
        }
    })

    query += '}'

    return query
}