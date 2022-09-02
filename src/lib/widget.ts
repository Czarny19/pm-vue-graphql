import router from "@/router/index";
import {i18n} from "@/main";
import {ActionProp, AppWidget, AppWidgetProp, PageVariable, QueryVariable, ThemeColors} from "@/lib/types";

export const themeColors = ['primary_color', 'secondary_color', 'accent_color', 'info_color',
    'success_color', 'error_color', 'text_color_1', 'text_color_2', 'background_color']

export const themeColorsPicker = [...themeColors, 'custom']

export const sizeUnits = ['px', '%', 'cm', 'pt', 'em', 'vw', 'vh', 'auto']

export const borders = ['dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'none', 'hidden']

export const generateInitialPageDefinition = (id: string) => {
    return {
        "id": id,
        "type": "Page",
        "label": "Strona",
        "icon": "fa-th",
        "datatable": "",
        "children": []
    }
}

export const groups = (widget: AppWidget) => {
    return widget ? widget.propGroups : []
}

export const getCssProps = (widget: AppWidget, theme: ThemeColors) => {
    let props: AppWidgetProp[] = []

    groups(widget).forEach((group) => props = props.concat(group.props))

    return props.map((prop: AppWidgetProp) => {
        if (prop.type === 'Color' && themeColors.includes(prop.value)) {
            return {[prop.id]: theme[prop.value as keyof ThemeColors]}
        }

        return {[prop.id]: prop.value + (prop.unit ?? '')}
    })
}

export const getArgsProps = (widget: AppWidget): { [k: string]: string } => {
    let argsProps: AppWidgetProp[] = []

    groups(widget)
        .filter((group) => group.type === 'args')
        .forEach((group) => argsProps = argsProps.concat(group.props))

    const argsObject: { [k: string]: string } = {}

    argsProps.forEach((prop: AppWidgetProp) => argsObject[prop.id] = prop.value)

    return argsObject
}

export const getDataProps = (widget: AppWidget): { [k: string]: string } => {
    let dataProps: AppWidgetProp[] = []

    groups(widget)
        .filter((group) => group.type === 'data')
        .forEach((group) => dataProps = dataProps.concat(group.props))

    const argsObject: { [k: string]: string } = {}

    dataProps.forEach((prop: AppWidgetProp) => argsObject[prop.id] = prop.value)

    return argsObject
}

export const getColorPropValue = (theme: ThemeColors, propName: string): string => {
    if (themeColors.includes(propName)) {
        return theme[propName as keyof ThemeColors]
    }

    return propName
}

export const getPageVarValue = (vars?: PageVariable[], pageVal?: number): string => {
    let pageValue = ''

    if (pageVal && pageVal > 0 && vars && vars.length) {
        const variable = vars.find((variable) => variable.id === pageVal)
        pageValue = variable ? variable.value : ''
    }

    return pageValue
}

export const getConstAndVarValue = (dataItem?: never, dataVal?: string,
                                    vars?: PageVariable[], pageVal?: number,
                                    routeParams?: { [k: string]: string }, paramVal?: string): string => {

    let dataValue = ''

    if (dataItem && dataVal) {
        dataValue = getRelationshipFirstDataValue(dataVal, dataItem)
    }

    const pageValue = getPageVarValue(vars, pageVal)

    let paramValue = ''

    if (routeParams && routeParams.params && paramVal) {
        const params = routeParams.params.split('&')
        const param = params.find((param) => param.includes(`${paramVal}=`))
        paramValue = param ? param.substring(param.indexOf('=') + 1) : ''
    }

    const values = [dataValue, pageValue, paramValue]

    return values.filter((value) => value && value.length).join(' ')
}

const getRelationshipFirstDataValue = (dataVal: string, dataItem?: never): string => {
    if (dataItem && dataVal && dataVal.includes('.')) {
        const relation = dataVal.substring(0, dataVal.indexOf('.'))
        return getRelationshipFirstDataValue(dataVal.substring(dataVal.indexOf('.') + 1), dataItem[relation])
    } else {
        return dataItem ? dataItem[dataVal] : ''
    }
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
        rules.push((v: string) => (v && !(new RegExp(props.customRegex).test(v))) || (props.customRegexMsg ?? ''))
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

export const runWidgetClickAction = (widget: AppWidget, projectId: string,
                                     dataItem?: never, vars?: PageVariable[], action?: number) => {

    const actionPropGroup = widget.propGroups.find((group: { type: string }) => group.type === 'action')

    if (actionPropGroup && action) {
        const props = actionPropGroup.props
        const prop = (props[action - 1] as unknown as ActionProp)

        prop.variables?.forEach((actionVar) => {
            if (actionVar.pageVar > 0) {
                actionVar.value = vars?.find((pageVar) => pageVar.id === actionVar.pageVar)?.value ?? ''
            } else if (actionVar.tableVar.length > 0) {
                actionVar.value = dataItem != undefined ? dataItem[actionVar.tableVar] : ''
            }
        })

        switch (prop.type) {
            case 'goToPage':
                runOpenPageAction(prop, projectId)
                break;
        }
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