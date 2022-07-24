import {SchemaItem} from "@/plugins/types";

export const ignoredObjects = [
    '_aggregate', '_aggregate_fields', '_avg_fields', '_max_fields', '_min_fields', '_mutation_response',
    '_stddev_fields', '_stddev_pop_fields', '_stddev_samp_fields', '_sum_fields', '_var_pop_fields',
    '_var_samp_fields', '_variance_fields', '__Directive', '__EnumValue', '__Field', '__InputValue',
    '_Schema', '__Type', 'mutation_root', 'query_root', 'subscription_root'
]

export const cleanSchema = (schema: SchemaItem []) => {
    const cleanSchema: SchemaItem [] = [];

    schema.forEach(item => {
        const schemaItem = (item as SchemaItem)

        const isObject = schemaItem.kind === 'OBJECT';
        const hasFields = schemaItem.fields;
        const nameNotIgnored = ignoredObjects.filter(ignored => schemaItem.name.endsWith(ignored)).length == 0

        if (isObject && hasFields && nameNotIgnored) {
            schemaItem.fields.forEach(field => {
                if (field.type && !field.type.ofType) {
                    field.type.ofType = {name: 'nullable'}
                }

                const typeName = field.type.ofType.name
                field.type.ofType.name = typeName.charAt(0).toUpperCase() + typeName.slice(1);
            })

            cleanSchema.push(schemaItem)
        }
    })

    return cleanSchema;
}