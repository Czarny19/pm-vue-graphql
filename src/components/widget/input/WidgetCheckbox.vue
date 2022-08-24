<template>
  <div :style="cssProps">
    <v-checkbox
        class="pa-0"
        light persistent-hint
        :label="argsProps.label"
        :color="color"
        :disabled="argsProps.disabled"
        :hint="argsProps.hint"
        :dense="argsProps.dense"
        :background-color="bgColor"
        :false-value="false"
        :true-value="true"
        :value="variableValue"
        :input-value="variableValue"
        on-icon="fa-square-check"
        off-icon="fa-square"
        @change="updateVariableValue">
    </v-checkbox>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {AppWidget, PageVariable} from "@/lib/types";
import {getArgsProps, getColorPropValue, getCssProps, getDataProps} from "@/lib/widget";

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
      return getCssProps(this.appWidget, this.theme)
    },
    argsProps(): { [k: string]: string } {
      return getArgsProps(this.appWidget)
    },
    dataProps(): { [k: string]: string } {
      return getDataProps(this.appWidget)
    },
    color(): string {
      return getColorPropValue(this.theme, this.argsProps.color)
    },
    bgColor(): string {
      return getColorPropValue(this.theme, this.argsProps.bgColor)
    },
    variable(): PageVariable | undefined {
      if (this.dataProps.variableId) {
        const variableId = Number(this.dataProps.variableId)
        return (this.variables as PageVariable[])?.filter((variable) => variable.id === variableId)[0]
      }

      return undefined
    },
    variableValue(): boolean | undefined {
      if (this.variable) {
        return Boolean(this.variable.value)
      }

      return false
    }
  },
  methods: {
    updateVariableValue(val: string): void {
      if (this.variable) {
        this.variable.value = val
      }
    }
  }
})
</script>

<style scoped>

</style>