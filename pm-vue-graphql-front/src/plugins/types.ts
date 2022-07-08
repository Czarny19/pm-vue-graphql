export type SchemaItem = {
    kind: string;
    name: string;
    description: string;
    fields: { name: string; type: { ofType: { name: string } } }[];
}

export type DataSource = {
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
