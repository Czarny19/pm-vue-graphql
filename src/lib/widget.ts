import router from "@/router/index";
import {i18n} from "@/main";
import * as graphql_gen from "@/lib/graphql_gen";
import {mapModelStringToQueryVariableArray, mutationType} from "@/lib/graphql_gen";
import {
    ActionProp,
    AppWidget,
    AppWidgetProp,
    ConditionProp,
    Datasource,
    Mutation,
    PageVariable,
    QueryResult,
    QueryVariable,
    ThemeColors
} from "@/lib/types";

export const themeColors = ['primary_color', 'secondary_color', 'accent_color', 'info_color',
    'success_color', 'error_color', 'text_color_1', 'text_color_2', 'background_color'];

export const themeColorsPicker = [...themeColors, 'custom'];

export const sizeUnits = ['px', '%', 'cm', 'pt', 'em', 'vw', 'vh', 'auto'];

export const borders = ['dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'none', 'hidden'];

export const numCondTypes = ['=', '!=', '>', '>=', '=null', '!=null', '<', '<='];

export const stringCondTypes = ['=', '!=', '>', '>=', '=null', '!=null', '<', '<=', '%', '!%'];

export const boolCondTypes = ['='];

/**
 * Generates a new page definition to be inserted on page add to the database.
 * @param id Page id
 * @returns New JSON page definition.
 **/
export const generateInitialPageDefinition = (id: string) => {
    return {"id": id, "type": "Page", "label": "Strona", "icon": "fa-th", "children": []};
}

/**
 * Checks if this widget should be displayed on the page based on the widget defined condtions.
 * @param widget The widget to be displayed {@link AppWidget}
 * @param dataItem The data item (Query result object) that the condition will be checked with
 * @returns The result of the condition check.
 **/
export const isWidgetVisible = (widget: AppWidget, dataItem?: never): boolean => {
    if (!dataItem) {
        return true;
    }

    const conditionGroups = widget ? widget.propGroups.slice() : [];

    let props: ConditionProp[] = [];

    conditionGroups
        .filter((group) => group.type === 'condition')
        .forEach((group) => props = props.concat(group.props as unknown as ConditionProp[]));

    for (const prop of props) {
        const cond = prop.condition;
        const condVal = prop.value?.toString();
        const dataValue = getQueryDataValue(dataItem, prop.field).toString();

        if ((dataValue && !checkIfWidgetConditionMet(dataValue, cond, condVal)) || !dataValue) {
            return false;
        }
    }

    return true;
}

const checkIfWidgetConditionMet = (actualValue: string, condition: string, expectedValue?: string): boolean => {
    actualValue = actualValue.toString();
    expectedValue = expectedValue?.toString();

    switch (condition) {
        case '=':
            return actualValue === expectedValue;
        case '!=':
            return actualValue !== expectedValue;
        case '>':
            return expectedValue ? actualValue > expectedValue : true;
        case '>=':
            return expectedValue ? actualValue >= expectedValue : true;
        case '=null':
            return (actualValue?.length ?? 0) === 0;
        case '!=null':
            return (actualValue?.length ?? 0) !== 0;
        case '<':
            return expectedValue ? actualValue < expectedValue : true;
        case '<=':
            return expectedValue ? actualValue <= expectedValue : true;
        case '%':
            return expectedValue ? actualValue.includes(expectedValue) : true;
        case '!%':
            return expectedValue ? !actualValue.includes(expectedValue) : true;
        default:
            return true;
    }
}

/**
 * Return all the widget css type props.
 * @param widget The widget to be displayed {@link AppWidget}
 * @param theme The project defined theme, used for value mappings {@link ThemeColors}
 * @returns The widgets css type props, mapped with theme values.
 **/
export const getCssProps = (widget: AppWidget, theme: ThemeColors) => {
    const propGroups = widget ? widget.propGroups.slice() : [];

    let cssProps: AppWidgetProp[] = [];

    propGroups
        .filter((group) => group.type === 'css')
        .forEach((group) => cssProps = cssProps.concat(group.props));

    return cssProps.map((prop: AppWidgetProp) => {
        if (prop.type === 'Color' && themeColors.includes(prop.value)) {
            return {[prop.id]: theme[prop.value as keyof ThemeColors]};
        }

        return {[prop.id]: prop.value + (prop.unit ?? '')};
    })
}

/**
 * Return all the widget args type props.
 * @param widget The widget to be displayed {@link AppWidget}
 * @returns The widgets args type props.
 **/
export const getArgsProps = (widget: AppWidget): { [k: string]: string } => {
    const propGroups = widget ? widget.propGroups.slice() : [];

    let argsProps: AppWidgetProp[] = [];

    propGroups
        .filter((group) => group.type === 'args')
        .forEach((group) => argsProps = argsProps.concat(group.props));

    const argsObject: { [k: string]: string } = {};

    argsProps.forEach((prop: AppWidgetProp) => argsObject[prop.id] = prop.value);

    return argsObject;
}

/**
 * Return all the widget data type props.
 * @param widget The widget to be displayed {@link AppWidget}
 * @returns The widgets data type props.
 **/
export const getDataProps = (widget: AppWidget): { [k: string]: string } => {
    const propGroups = widget ? widget.propGroups.slice() : [];

    let dataProps: AppWidgetProp[] = [];

    propGroups
        .filter((group) => group.type === 'data')
        .forEach((group) => dataProps = dataProps.concat(group.props));

    const argsObject: { [k: string]: string } = {};

    dataProps.forEach((prop: AppWidgetProp) => argsObject[prop.id] = prop.value);

    return argsObject;
}

/**
 * Return the actual color hex value of a property, based on the property theme value.
 * @param theme The project defined theme, used for value mappings {@link ThemeColors}
 * @param propName The css prop name
 * @returns The hex color value.
 **/
export const getColorPropValue = (theme: ThemeColors, propName: string): string => {
    return themeColors.includes(propName) ? theme[propName as keyof ThemeColors] : propName;
}

/**
 * Gets the actual value of a page variable, based on the widget variable property id.
 * @param vars The page defined variables (list of page variables {@link PageVariable})
 * @param pageVarId The page variable id
 * @returns Value of the actual page parameter.
 **/
export const getPageVariableValue = (vars?: PageVariable[], pageVarId?: number): string => {
    let pageValue = '';

    if (pageVarId && pageVarId > 0 && vars && vars.length) {
        const variable = vars.find((variable) => variable.id === pageVarId);
        pageValue = variable ? variable.value : '';
    }

    return pageValue;
}

/**
 * Gets the actual value of a route page parameter, based on the widget page parameter property id.
 * @param routeParams Vue route parameters ($route.params)
 * @param pageParamName The route parameter name
 * @returns Value of the actual page parameter.
 **/
export const getPageParamValue = (routeParams?: { [k: string]: string }, pageParamName?: string): string => {
    if (routeParams && routeParams.params && pageParamName) {
        const params = routeParams.params.split('&');
        const param = params.find((param) => param.includes(`${pageParamName}=`));
        return param ? param.substring(param.indexOf('=') + 1) : '';
    }

    return '';
}

/**
 * Gets the actual value of a widget page parameter type property, from the page route parameters.
 * @param dataItem The data item (Query result object) that the value should be found in
 * @param queryFieldName The data item field name
 * @returns Value of the actual data table parameter.
 **/
export const getQueryDataValue = (dataItem?: never, queryFieldName?: string): string => {
    if (!queryFieldName || !dataItem) {
        return '';
    }

    const fieldIsRelation = dataItem && queryFieldName && queryFieldName.includes('.');

    if (fieldIsRelation) {
        const relation = queryFieldName.substring(0, queryFieldName.indexOf('.'));
        const name = queryFieldName.substring(queryFieldName.indexOf('.') + 1);

        return getQueryDataValue(dataItem[relation], name);
    }

    return dataItem ? dataItem[queryFieldName] : '';
}

/**
 * Creates the display value of a display widget, based on values of the widget page parameter,
 * page variable and query data field.
 * The final value is constructed as `{pageParamValue} {pageVarValue} {queryDataValue}`
 * @param dataItem The data item (Query result object) that the value should be found in
 * @param queryFieldName The data item field name
 * @param vars The page defined variables
 * @param pageVarId The page variable id
 * @param routeParams Vue route parameters ($route.params)
 * @param pageParamName The route parameter name
 * @returns Display string to be shown on the widget.
 **/
export const getDisplayWidgetVarValue = (dataItem?: never, queryFieldName?: string,
                                         vars?: PageVariable[], pageVarId?: number,
                                         routeParams?: { [k: string]: string }, pageParamName?: string): string => {

    const pageParamValue = getPageParamValue(routeParams, pageParamName);
    const pageVarValue = getPageVariableValue(vars, pageVarId);
    const queryDataValue = getQueryDataValue(dataItem, queryFieldName);

    return [pageParamValue, pageVarValue, queryDataValue].filter((value) => value && value.length).join(' ');
}

/**
 * Gets the initial value of an input widget, based on values of the widget page parameter and page variable.
 * The final value is constructed as `{pageParamValue} {pageVarValue}`
 * @param vars The page defined variables
 * @param pageVarId The page variable id
 * @param routeParams Vue route parameters ($route.params)
 * @param pageParamName The route parameter name
 * @returns Initial value string of the widget.
 **/
export const getInputWidgetInitialValue = (vars?: PageVariable[], pageVarId?: number,
                                           routeParams?: { [k: string]: string }, pageParamName?: string): string => {

    const pageParamValue = getPageParamValue(routeParams, pageParamName);
    const pageVarValue = getPageVariableValue(vars, pageVarId);

    return [pageParamValue, pageVarValue].filter((value) => value && value.length).join(' ');
}

/**
 * Gets the list of rules for an input widget based on the widget validation options and counter value.
 * @param widget The widget to be displayed {@link AppWidget}
 * @param counter Value of the input field counter
 * @returns List of input rules.
 **/
export const getRulesForInput = (widget: AppWidget, counter?: number): unknown[] => {
    const rules = [];
    const props = getArgsProps(widget);

    if (props.required) {
        rules.push((v: string) => (!!v) || i18n.t('editor.valueRequired'));
    }

    if (counter) {
        rules.push((v: string) =>
            (!v || (v && v.length <= Number(counter ?? 0))) || i18n.t('editor.valueTooLong'));
    }

    if (props.specialChars) {
        rules.push((v: string) => (!v || (v && !/[^a-zA-Z0-9]/.test(v)) || i18n.t('editor.valueNoSpecialChars')));
    }

    if (props.customRegex) {
        const regex = new RegExp(props.customRegex.replaceAll('/', ''));
        rules.push((v: string) => (!v || v && regex.test(v)) || (props.customRegexMsg ?? ''));
    }

    if (props.mustBeChecked) {
        rules.push((v: boolean) => v || i18n.t('editor.valueRequired'));
    }

    return rules;
}

/**
 * List of action types that a widget can execute.
 * @returns List of widget actions.
 **/
export const getActionTypes = (): { id: string; name: string }[] => [
    {id: 'goToPage', name: i18n.t('editor.actionGoTo').toString()},
    {id: 'runMutation', name: i18n.t('editor.actionRunMutation').toString()}
];

/**
 * Returns an ordered list of a query property custom labels defined for the widget.
 * @param widget The widget to be displayed {@link AppWidget}
 * @returns List of custom labels.
 **/
export const getQueryPropLabels = (widget: AppWidget): { text: string; value: string }[] => {
    const dataPropGroup = widget.propGroups.find((group) => group.type === 'data');

    if (dataPropGroup) {
        const props = dataPropGroup.props;
        const query = props.find((prop) => prop.id === 'queryId');

        if (query && query.labels) {
            return query.labels
                .filter(label => label.visible)
                .sort((a, b) => Number(a.order) - Number(b.order));
        }
    }

    return [];
}

/**
 * Returns the name of the table that the widget uses as a source of its data (Property `dataTable`, group `source`).
 * @param widget The widget to be displayed {@link AppWidget}
 * @returns Name of the table.
 **/
export const getTableNameForWidget = (widget: AppWidget): string => {
    const dataPropGroups = widget.propGroups.find((group) => group.id === 'source');

    if (dataPropGroups) {
        const props = dataPropGroups.props;
        const dataTable = props.find((prop) => prop.id === 'dataTable');
        return dataTable ? dataTable.value : '';
    }

    return '';
}

/**
 * Updates the widget query where parameters value with actual page variables value.
 * @param widget The widget to be displayed {@link AppWidget}
 * @param queryVars GraphQL query variables (list of {@link QueryVariable})
 * @param pageVars Page variables (list of {@link PageVariable})
 * @returns Name of the table.
 **/
export const mapPageVarValuesToQueryVars = (widget: AppWidget, queryVars: QueryVariable[],
                                            pageVars: PageVariable[]): QueryVariable[] => {

    const dataPropGroup = widget.propGroups.find((group: { type: string }) => group.type === 'data');

    if (dataPropGroup) {
        const props = dataPropGroup.props;
        const query = props.find((prop) => prop.id === 'queryId');

        if (query && query.variablesMapping) {
            queryVars.forEach((qrVar) => {
                const mapping = query.variablesMapping?.find((mapping) => mapping.qrVar === qrVar.name);
                const pageVar = pageVars.find((variable) => variable.id === mapping?.pageVar);
                qrVar.value = pageVar?.value ?? '';
            })
        }
    }

    return queryVars;
}

/**
 * Creates an error message for an action, based on the custom error message defined on a widget and the actual error.
 * @param action The action that resulted in an error {@link ActionProp}
 * @param vars The page defined variables (list of page variables {@link PageVariable})
 * @param errorMsg The actual error message
 * @returns The string error message.
 **/
export const getActionErrorMsg = (action: ActionProp, vars?: PageVariable[], errorMsg?: string): string => {
    let msg = '';

    if (action.errorMsgVar) {
        msg += getPageVariableValue(vars, action.errorMsgVar);
    }

    if (action.errorMsgShowResponse && errorMsg) {
        msg += `\n ${i18n.t('runtime.error')}: ${errorMsg}`;
    }

    if (!msg.trim().length) {
        msg = i18n.t('runtime.errorOccured').toString();
    }

    return msg;
}

/**
 * Launches an action ({@link runOpenPageAction} / ${@link runMutationAction}).
 * @param action The action that resulted in an error {@link ActionProp}
 * @param projectId Id of the current app project
 * @param datasource The graphQL datasource the action should be run on
 * @param dataItem The data item (Query result object) used as an argument source for the action
 * @param vars The page defined variables (list of page variables {@link PageVariable})
 * used as an argument source for the action
 * @param routeParams Vue route parameters ($route.params) used as an argument source for the action
 * @param mutations List of mutations defined for this project {@link Mutation}
 * @returns The result of a mutation if run.
 **/
export const runWidgetClickAction = async (action: ActionProp, projectId: string,
                                           datasource: Datasource, dataItem?: never,
                                           vars?: PageVariable[],
                                           routeParams?: { [k: string]: string },
                                           mutations?: Mutation[]): Promise<QueryResult | undefined> => {

    action.variables?.forEach((actionVar) => {
        if (actionVar.pageVar > 0) {
            actionVar.value = getPageVariableValue(vars, actionVar.pageVar);
        } else if (actionVar.tableVar && actionVar.tableVar.length > 0) {
            actionVar.value = getQueryDataValue(dataItem, actionVar.tableVar);
        } else if (actionVar.paramVar && actionVar.paramVar.length > 0) {
            actionVar.value = getPageParamValue(routeParams, actionVar.paramVar);
        }
    })

    switch (action.type) {
        case 'goToPage':
            runOpenPageAction(action, projectId);
            return undefined;
        case 'runMutation':
            return await runMutationAction(action, projectId, datasource, mutations);
    }
}

export const runOpenPageAction = (action: ActionProp, projectId: string) => {
    const params = action.variables.map((variable) => `${variable.name}=${variable.value}`);

    router.push({
        name: 'AppRunner', params: {projectId: projectId, pageId: action.target.toString(), params: params.join('&')}
    }).then();
}

export const runMutationAction = async (action: ActionProp, projectId: string, datasource: Datasource,
                                        mutations?: Mutation[]): Promise<QueryResult | undefined> => {

    const mutation = mutations?.find((mutation) => mutation.id === action.target);

    if (!mutation) {
        return undefined;
    }

    const where = graphql_gen.mapModelStringToQueryWhereArray(mutation.where ?? '');
    const variables = [...mapModelStringToQueryVariableArray(mutation.variables ?? '') ?? []];
    const fields = graphql_gen.mapModelStringToQuerySetValueArray(mutation.fields ?? '');

    variables.forEach((variable) => {
        const param = action.variables.find((actionVar) => actionVar.name === variable.name);
        if (param) variable.value = param?.value;
    })

    const mutationVars = variables.map((variable) => JSON.stringify(variable)).join(';');

    const graphQLMutation = graphql_gen.generateGraphQLMutation(mutation.name, mutation.table,
        mutation.type as mutationType, fields, where, variables);

    return await graphql_gen.runMutation(datasource.address, graphQLMutation, mutation.table,
        mutation.type as mutationType, datasource.secret, mutationVars);
}