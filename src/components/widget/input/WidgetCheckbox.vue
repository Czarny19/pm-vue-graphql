<template>
  <div :style="cssProps">
    <v-checkbox
        class="pa-0"
        light persistent-hint
        :label="label"
        :color="color"
        :disabled="argsProps.disabled"
        :hint="hint"
        :dense="argsProps.dense"
        :background-color="bgColor"
        :false-value="false"
        :true-value="true"
        :value="variableValue"
        :input-value="variableValue"
        :rules="rules"
        on-icon="fa-square-check"
        off-icon="fa-square"
        @change="updateVariableValue">
    </v-checkbox>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {AppWidget, PageVariable} from "@/lib/types";
import * as widget from "@/lib/widget";

export default Vue.extend({
  name: 'WidgetCheckbox',
  props: {
    widget: Object,
    theme: Object,
    variables: Array
  },
  computed: {
    appWidget(): AppWidget {
      return this.widget as AppWidget
    },
    cssProps(): ({ [p: string]: string })[] {
      return widget.getCssProps(this.appWidget, this.theme)
    },
    argsProps(): { [k: string]: string } {
      return widget.getArgsProps(this.appWidget)
    },
    dataProps(): { [k: string]: string } {
      return widget.getDataProps(this.appWidget)
    },
    color(): string {
      return widget.getColorPropValue(this.theme, this.argsProps.color)
    },
    bgColor(): string {
      return widget.getColorPropValue(this.theme, this.argsProps.bgColor)
    },
    label(): string {
      return widget.getPageVarValue(this.variables as PageVariable[], Number(this.argsProps.label))
    },
    hint(): string {
      return widget.getPageVarValue(this.variables as PageVariable[], Number(this.argsProps.hint))
    },
    variable(): PageVariable | undefined {
      if (this.dataProps.variableId) {
        const variableId = Number(this.dataProps.variableId)
        return (this.variables as PageVariable[])?.find((variable) => variable.id === variableId)
      }

      return undefined
    },
    variableValue(): boolean | undefined {
      if (this.variable) {
        return Boolean(this.variable.value)
      }

      return false
    },
    rules(): unknown[] {
      return widget.getRulesForInput(this.appWidget, undefined)
    }
  },
  methods: {
    updateVariableValue(val: string): void {
      if (this.variable) {
        this.variable.value = val
      }
    }
  },
  beforeMount() {
    const variables = this.variables as PageVariable[]
    const pagePropVal = Number(this.dataProps.initalPageVarId)

    const params = this.$route.params
    const paramPropVal = this.dataProps.initalParamVarId

    const intialValue = widget.getInputWidgetInitialValue(variables, pagePropVal, params, paramPropVal)

    this.updateVariableValue(intialValue)
  }
})
</script>

<style scoped>

</style>