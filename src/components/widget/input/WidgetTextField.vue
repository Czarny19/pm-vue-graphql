<template>
  <div :style="cssProps">
    <v-text-field
        class="pa-0"
        light
        :label="argsProps.label"
        :counter="counter"
        :color="color"
        :readonly="argsProps.readonly"
        :disabled="argsProps.disabled"
        :hint="argsProps.hint"
        :dense="argsProps.dense"
        :filled="argsProps.filled"
        :background-color="bgColor"
        :outlined="argsProps.outlined"
        :single-line="argsProps.singleLine"
        persistent-hint
        :value="variableValue"
        :rules="rules"
        @change="updateVariableValue">
    </v-text-field>
    {{ variable }}
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {AppWidget, PageVariable} from "@/lib/types";
import {getArgsProps, getColorPropValue, getCssProps, getDataProps, getRulesForInput} from "@/lib/widget";

export default Vue.extend({
  name: 'WidgetTextField',
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
    counter(): number | undefined {
      return this.argsProps.counter ? Number(this.argsProps.counterNum) : undefined
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
    variableValue(): string | undefined {
      if (this.variable) {
        return this.variable.value
      }

      return undefined
    },
    rules(): unknown[] {
      return getRulesForInput(this.appWidget, this.counter)
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