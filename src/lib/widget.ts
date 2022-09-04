import router from "@/router/index";
import {i18n} from "@/main";
import {ActionProp, AppWidget, AppWidgetProp, PageVariable, QueryVariable, ThemeColors} from "@/lib/types";

export const themeColors = ['primary_color', 'secondary_color', 'accent_color', 'info_color',
    'success_color', 'error_color', 'text_color_1', 'text_color_2', 'background_color']

export const themeColorsPicker = [...themeColors, 'custom']

export const sizeUnits = ['px', '%', 'cm', 'pt', 'em', 'vw', 'vh', 'auto']

export const borders = ['dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'none', 'hidden']

export const generateInitialPageDefinition = (id: string) => {
    return {"id": id, "type": "Page", "label": "Strona", "icon": "fa-th", "children": []}
}

export const getCssProps = (widget: AppWidget, theme: ThemeColors) => {
    const propGroups = widget ? widget.propGroups.slice() : []

    let cssProps: AppWidgetProp[] = []

    propGroups
        .filter((group) => group.type === 'css')
        .forEach((group) => cssProps = cssProps.concat(group.props))

    return cssProps.map((prop: AppWidgetProp) => {
        if (prop.type === 'Color' && themeColors.includes(prop.value)) {
            return {[prop.id]: theme[prop.value as keyof ThemeColors]}
        }

        return {[prop.id]: prop.value + (prop.unit ?? '')}
    })
}

export const getArgsProps = (widget: AppWidget): { [k: string]: string } => {
    const propGroups = widget ? widget.propGroups.slice() : []

    let argsProps: AppWidgetProp[] = []

    propGroups
        .filter((group) => group.type === 'args')
        .forEach((group) => argsProps = argsProps.concat(group.props))

    const argsObject: { [k: string]: string } = {}

    argsProps.forEach((prop: AppWidgetProp) => argsObject[prop.id] = prop.value)

    return argsObject
}

export const getDataProps = (widget: AppWidget): { [k: string]: string } => {
    const propGroups = widget ? widget.propGroups.slice() : []

    let dataProps: AppWidgetProp[] = []

    propGroups
        .filter((group) => group.type === 'data')
        .forEach((group) => dataProps = dataProps.concat(group.props))

    const argsObject: { [k: string]: string } = {}

    dataProps.forEach((prop: AppWidgetProp) => argsObject[prop.id] = prop.value)

    return argsObject
}

export const getColorPropValue = (theme: ThemeColors, propName: string): string => {
    return themeColors.includes(propName) ? theme[propName as keyof ThemeColors] : propName
}

export const getPageVarValue = (vars?: PageVariable[], pageVal?: number): string => {
    let pageValue = ''

    if (pageVal && pageVal > 0 && vars && vars.length) {
        const variable = vars.find((variable) => variable.id === pageVal)
        pageValue = variable ? variable.value : ''
    }

    return pageValue
}

export const getParamVarValue = (routeParams?: { [k: string]: string }, paramVal?: string): string => {
    if (routeParams && routeParams.params && paramVal) {
        const params = routeParams.params.split('&')
        const param = params.find((param) => param.includes(`${paramVal}=`))
        return param ? param.substring(param.indexOf('=') + 1) : ''
    }

    return ''
}

export const getDataVarValueAsString = (dataVal?: string, dataItem?: never): string => {
    if (!dataVal || !dataItem) {
        return ''
    }

    const valIsRelation = dataItem && dataVal && dataVal.includes('.')

    if (valIsRelation) {
        const relation = dataVal.substring(0, dataVal.indexOf('.'))
        const val = dataVal.substring(dataVal.indexOf('.') + 1)

        return getDataVarValueAsString(val, dataItem[relation])
    }

    if (Array.isArray(dataItem)) {
        return (dataItem as never[]).map((item) => item[dataVal]).join(' ')
    }

    return dataItem ? dataItem[dataVal] : ''
}

export const getDataVarValueAsArray = (pageValue: string, paramValue: string, dataVal?: string,
                                       dataItem?: never): string => {

    if (!dataVal || !dataItem) {
        return `${paramValue} ${pageValue}`.trim()
    }

    const valIsRelation = dataItem && dataVal && dataVal.includes('.')

    if (valIsRelation) {
        const relation = dataVal.substring(0, dataVal.indexOf('.'))
        const val = dataVal.substring(dataVal.indexOf('.') + 1)

        return getDataVarValueAsArray(pageValue, paramValue, val, dataItem[relation])
    }

    if (Array.isArray(dataItem)) {
        return (dataItem as never[])
            .map((item) => `${paramValue} ${pageValue} ${item[dataVal]}`.trim())
            .join('<>')
    }

    return `${paramValue} ${pageValue} ${dataItem ? dataItem[dataVal] : ''}`.trim()
}

export const getDisplayWidgetVarValue = (dataItem?: never, dataVal?: string, vars?: PageVariable[], pageVal?: number,
                                         routeParams?: { [k: string]: string }, paramVal?: string): string => {

    const dataValue = getDataVarValueAsString(dataVal, dataItem)
    const pageValue = getPageVarValue(vars, pageVal)
    const paramValue = getParamVarValue(routeParams, paramVal)

    const values = [dataValue, pageValue, paramValue]

    return values.filter((value) => value && value.length).join(' ')
}

export const getDisplayWidgetVarValues = (dataItem?: never, dataVal?: string, vars?: PageVariable[], pageVal?: number,
                                          routeParams?: { [k: string]: string }, paramVal?: string): string => {

    const pageValue = getPageVarValue(vars, pageVal)
    const paramValue = getParamVarValue(routeParams, paramVal)
    return getDataVarValueAsArray(pageValue, paramValue, dataVal, dataItem)
}

export const getInputWidgetInitialValue = (vars?: PageVariable[], pageVal?: number,
                                           routeParams?: { [k: string]: string }, paramVal?: string): string => {

    const pageValue = getPageVarValue(vars, pageVal)
    const paramValue = getParamVarValue(routeParams, paramVal)

    const values = [pageValue, paramValue]

    return values.filter((value) => value && value.length).join(' ')
}

export const getRulesForInput = (widget: AppWidget, counter: number | undefined): unknown[] => {
    const rules = []
    const props = getArgsProps(widget)

    if (props.required) {
        rules.push((v: string) => (!!v) || i18n.t('editor.valueRequired'))
    }

    // TODO
    if (counter) {
        rules.push((v: string) => (v && v.length <= Number(counter ?? 0)) || i18n.t('editor.valueTooLong'))
    }

    if (props.specialChars) {
        rules.push((v: string) => (v && !/[^a-zA-Z0-9]/.test(v)) || i18n.t('editor.valueNoSpecialChars'))
    }

    if (props.customRegex) {
        const regex = new RegExp(props.customRegex.replaceAll('/', ''))
        rules.push((v: string) => (v && regex.test(v)) || (props.customRegexMsg ?? ''))
    }

    if (props.mustBeChecked) {
        rules.push((v: boolean) => v || i18n.t('editor.valueRequired'))
    }

    return rules
}

export const getActionTypes = (): { id: string; name: string }[] => [
    {id: 'goToPage', name: i18n.t('editor.actionGoTo').toString()},
    {id: 'runMutation', name: i18n.t('editor.actionRunMutation').toString()}
]

export const getQueryPropLabels = (widget: AppWidget): { text: string; value: string }[] => {
    const dataPropGroup = widget.propGroups.find((group) => group.type === 'data')

    if (dataPropGroup) {
        const props = dataPropGroup.props
        const prop = props.find((prop) => prop.id === 'queryId')

        if (prop && prop.labels) {
            return prop.labels
                .filter(label => label.visible)
                .sort((a, b) => Number(a.order) - Number(b.order))
        }
    }

    return []
}

export const getTableNameForWidget = (widget: AppWidget): string => {
    const dataPropGroups = widget.propGroups.find((group) => group.id === 'source')

    if (dataPropGroups) {
        const props = dataPropGroups.props
        const prop = props.find((prop) => prop.id === 'dataTable')
        return prop ? prop.value : ''
    }

    return ''
}

export const mapPageVarValuesToQueryVars = (widget: AppWidget, qrVars: QueryVariable[],
                                            pageVars: PageVariable[]): QueryVariable[] => {

    const dataPropGroup = widget.propGroups.find((group: { type: string }) => group.type === 'data')

    if (dataPropGroup) {
        const props = dataPropGroup.props
        const prop = props.find((prop) => prop.id === 'queryId')

        if (prop && prop.variablesMapping) {
            qrVars.forEach((qrVar) => {
                const mapping = prop.variablesMapping?.find((mapping) => mapping.qrVar === qrVar.name)
                const pageVar = pageVars.find((variable) => variable.id === mapping?.pageVar)
                qrVar.value = pageVar?.value ?? ''
            })
        }

    }

    return qrVars
}

export const runWidgetClickAction = (action: ActionProp, projectId: string, itemIndex: number, dataItem?: never,
                                     vars?: PageVariable[], routeParams?: { [k: string]: string }) => {

    action.variables?.forEach((actionVar) => {
        if (actionVar.pageVar > 0) {
            actionVar.value = getPageVarValue(vars, actionVar.pageVar)
        } else if (actionVar.tableVar.length > 0) {
            const values = getDataVarValueAsArray('', '', actionVar.tableVar, dataItem)

            if (values.includes('<>')) {
                actionVar.value = values.split('<>')[itemIndex]
            } else {
                actionVar.value = values
            }
        } else if (actionVar.paramVar.length > 0) {
            actionVar.value = getParamVarValue(routeParams, actionVar.paramVar)
        }
    })

    switch (action.type) {
        case 'goToPage':
            runOpenPageAction(action, projectId)
            break;
    }
}

const runOpenPageAction = (prop: ActionProp, projectId: string) => {
    const params = prop.variables.map((variable) => `${variable.name}=${variable.value}`)

    router.push({
        name: 'AppRunner', params: {
            projectId: projectId,
            pageId: prop.target.toString(),
            params: params.join('&')
        }
    }).then()
}