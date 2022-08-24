export type AppProject = {
    id: number;
    name: string;
    description: string;
    theme_id: number | undefined;
    source_id: number | undefined;
}

export type Datasource = {
    id: number;
    name: string;
    address: string;
    secret: string | undefined;
    isConnected: boolean;
    schema: SchemaItem[];
}

export type SchemaItem = {
    kind: string;
    name: string;
    description: string;
    fields: SchemaItemField[];
}

export type SchemaItemField = {
    name: string;
    type: string;
    isNullable: boolean;
}

export type SchemaConnectionHeaders = {
    'authorization': string;
    'content-type': string;
    'x-hasura-admin-secret': string;
}

export type SchemaConnectionResult = {
    schema: [];
    errorMsg: string;
}

export type CleanSchemaConnectionResult = {
    schema: SchemaItem[];
    errorMsg: string;
}

export type Theme = {
    id: number;
    name: string;
    colors: ThemeColors;
}

export type ThemeColors = {
    primary_color: string;
    secondary_color: string;
    accent_color: string;
    info_color: string;
    success_color: string;
    error_color: string;
    text_color_1: string;
    text_color_2: string;
    background_color: string;
}

export type AppWidget = {
    id: number;
    type: string;
    group: string;
    children: [];
    propGroups: [];
}

export type AppWidgetProp = {
    id: string;
    value: string;
    unit?: string;
    type: string;
    dataType: string;
}

export type Query = {
    id: number;
    name: string;
    table: string;
    modify_date: Date;
    limit: number | undefined;
    order_by: string;
    where: string;
    fields: string;
    variables: string;
}

export type QueryVariable = {
    name: string;
    type: string;
    value: string;
}

export type QueryWhere = {
    field: string;
    operator: string;
    variable: string;
    isAnd: boolean;
}

export type QueryOrderBy = {
    field: string;
    isAsc: boolean;
}

export type QueryResult = {
    isSuccessful: boolean;
    data: unknown[];
    error?: string;
}

export type QuerySetValue = {
    name: string;
    type: string;
    variable: string;
}

export type Mutation = {
    id: number;
    name: string;
    table: string;
    type: string;
    where: string;
    fields: string;
    variables: string;
    modify_date: Date;
}

export type TableHeader = {
    text: string;
    value: string;
    order: number;
    visible: boolean;
}

export type PageVariable = {
    id: number;
    name: string;
    type: string;
    type_display: string;
    value: string;
}