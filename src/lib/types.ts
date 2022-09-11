export type AppProject = {
    id: number;
    name: string;
    description: string;
    theme_id?: number;
    source_id?: number;
    start_page?: number;
    top_nav: boolean;
    top_nav_items: { items: { name: string, page: number }[] }
    running: boolean;
}

export type Datasource = {
    id: number;
    name: string;
    address: string;
    secret?: string;
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
    isList: boolean;
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
    move: boolean;
    children: [];
    propGroups: AppWidgetPropGroup[];
}

export type AppWidgetPropGroup = {
    id: string;
    label: string;
    type: string;
    props: AppWidgetProp[]
}

export type AppWidgetProp = {
    id: string;
    value: string;
    unit?: string;
    type: string;
    dataType: string;
    labels?: TableHeader[];
    variablesMapping?: QueryPagePropMapping[];
}

export type Query = {
    id: number;
    name: string;
    table: string;
    modify_date: Date;
    limit?: number;
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
    required: boolean;
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

export type Page = {
    id: number;
    name: string;
    definition: never;
    params: string;
    modify_date: Date;
}

export type PageVariable = {
    id: number;
    name: string;
    type: string;
    type_display: string;
    value: string;
}

export type ActionProp = {
    id: number;
    type: string;
    target: number;
    errorMsgVar?: number;
    errorMsgShowResponse: boolean;
    variables: ActionPropVariable[];
}

export type ActionPropVariable = {
    name: string;
    type: string;
    value: string;
    varType: number;
    pageVar: number;
    table: string;
    tableVar: string;
    paramVar: string;
}

export type ConditionProp = {
    id: number;
    table: string;
    field: string;
    condition: string;
    value?: string | number | boolean;
}

export type QueryPagePropMapping = {
    qrVar: string;
    pageVar?: number;
    type: string;
}