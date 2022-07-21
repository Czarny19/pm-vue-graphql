import {AppWidget, AppWidgetProp, Colors} from "@/plugins/types";

export const themeColors = ['primary_color', 'secondary_color', 'accent_color', 'info_color',
    'success_color', 'error_color', 'text_color_1', 'text_color_2', 'background_color']

export const groups = (widget: AppWidget) => {
    return widget ? widget.propGroups : []
}

export const getCssProps = (widget: AppWidget, theme: Colors) => {
    let props: AppWidgetProp[] = []

    groups(widget).forEach((group: { props: AppWidgetProp }) => props = props.concat(group.props))

    return props.map((prop: AppWidgetProp) => {
        if (prop.type === 'Color' && themeColors.includes(prop.value)) {
            return {[prop.id]: theme[prop.value as keyof Colors]}
        }

        return {[prop.id]: prop.value + (prop.unit ?? '')}
    })
}

export const getArgsProps = (widget: AppWidget) => {
    let argsProps: AppWidgetProp[] = []

    groups(widget)
        .filter((group: { type: string }) => group.type === 'args')
        .forEach((group: { props: AppWidgetProp }) => argsProps = argsProps.concat(group.props))

    const argsObject: { [k: string]: string } = {}

    argsProps.forEach((prop: AppWidgetProp) => argsObject[prop.id] = prop.value)

    return argsObject
}