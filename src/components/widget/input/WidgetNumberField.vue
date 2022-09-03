<template>
  <div :style="cssProps">
    <v-text-field
        v-if="initialized"
        class="pa-0"
        light persistent-hint
        :label="label"
        :counter="counter"
        :color="color"
        :readonly="argsProps.readonly"
        :disabled="argsProps.disabled"
        :hint="hint"
        :dense="argsProps.dense"
        :filled="argsProps.filled"
        :background-color="bgColor"
        :outlined="argsProps.outlined"
        :single-line="argsProps.singleLine"
        :value="variableValue"
        :rules="rules"
        @input="updateVariableValue"
        @keydown="filterNumbersOnly">
    </v-text-field>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {AppWidget, PageVariable} from "@/lib/types";
import {filterFloatNumbersOnly, filterNumbersOnly} from "@/lib/filters";
import * as widget from "@/lib/widget";

export default Vue.extend({
  name: 'WidgetNumberField',
  props: {
    widget: Object,
    theme: Object,
    variables: Array
  },
  data() {
    return {
      initialized: false
    }
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
    counter(): number | undefined {
      return this.argsProps.counter ? Number(this.argsProps.counterNum) : undefined
    },
    color(): string {
      return widget.getColorPropValue(this.theme, this.argsProps.color)
    },
    bgColor(): string {
      return widget.getColorPropValue(this.theme, this.argsProps.bgColor)
    },
    label(): string {
      return widget.getPageVarValue((this.variables as PageVariable[]), Number(this.argsProps.label))
    },
    hint(): string {
      return widget.getPageVarValue((this.variables as PageVariable[]), Number(this.argsProps.hint))
    },
    variable(): PageVariable | undefined {
      if (this.dataProps.variableId) {
        const variableId = Number(this.dataProps.variableId)
        return (this.variables as PageVariable[])?.find((variable) => variable.id === variableId)
      }

      return undefined
    },
    variableValue(): number | undefined {
      if (this.variable && this.initialized) {
        return Number(this.variable.value)
      }

      return undefined
    },
    rules(): unknown[] {
      return widget.getRulesForInput(this.appWidget, this.counter)
    }
  },
  methods: {
    updateVariableValue(val: string): void {
      if (this.variable) {
        this.variable.value = val
      }
    },
    filterNumbersOnly(event: KeyboardEvent) {
      if (this.argsProps.notFloat) {
        filterNumbersOnly(event)
      } else {
        filterFloatNumbersOnly(event)
      }
    }
  },
  beforeMount() {
    if (!this.initialized) {
      const variables = (this.variables as PageVariable[])
      const pagePropVal = Number(this.dataProps.initalPageVarId)

      const params = this.$route.params
      const paramPropVal = this.dataProps.initalParamVarId

      const intialValue = widget.getInputWidgetInitialValue(variables, pagePropVal, params, paramPropVal)

      this.updateVariableValue(intialValue)
      this.initialized = true
    }
  }
})
</script>

<style scoped>

</style>