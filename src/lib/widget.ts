import {AppWidget, AppWidgetProp, ThemeColors} from "@/lib/types";
import {i18n} from "@/main";

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

    groups(widget).forEach((group: { props: AppWidgetProp }) => props = props.concat(group.props))

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
        .filter((group: { type: string }) => group.type === 'args')
        .forEach((group: { props: AppWidgetProp }) => argsProps = argsProps.concat(group.props))

    const argsObject: { [k: string]: string } = {}

    argsProps.forEach((prop: AppWidgetProp) => argsObject[prop.id] = prop.value)

    return argsObject
}

export const getDataProps = (widget: AppWidget): { [k: string]: string } => {
    let dataProps: AppWidgetProp[] = []

    groups(widget)
        .filter((group: { type: string }) => group.type === 'data')
        .forEach((group: { props: AppWidgetProp }) => dataProps = dataProps.concat(group.props))

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

export const getConstAndDataValue = (constVal: string, dataItem: never, dataVal: string): string => {
    return (constVal ? constVal : '') + ' ' + (dataItem && dataVal ? dataItem[dataVal] : '')
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