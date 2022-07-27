export type SchemaItem = {
    kind: string;
    name: string;
    description: string;
    fields: { name: string; type: { ofType: { name: string } } }[];
}

export type Datasource = {
    id: number;
    name: string;
    address: string;
    secret: string | undefined;
    isConnected: boolean;
    schema: SchemaItem[];
}

export type Theme = {
    id: number;
    name: string;
    colors: Colors;
}

export type Colors = {
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
    limit: number;
    order_by: string;
    where: string;
    fields: string;
    variables: QueryVariable [] | undefined;
}

export type QueryVariable = {
    name: string;
    type: string;
    value: string;
}

export type QueryWherePart = {
    field: string;
    operator: string;
    variable: string;
    isAnd: boolean;
}

export type QueryOrderBy = {
    field: string;
    isAsc: boolean;
}