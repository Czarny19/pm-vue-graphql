<template>
  <div :style="cssProps">
    <v-textarea
        v-if="initialized"
        class="pa-0"
        light persistent-hint
        :label="label"
        :counter="counter"
        :rows="argsProps.rows"
        :color="color"
        :readonly="argsProps.readonly"
        :disabled="argsProps.disabled"
        :hint="hint"
        :dense="argsProps.dense"
        :filled="argsProps.filled"
        :background-color="bgColor"
        :outlined="argsProps.outlined"
        :no-resize="argsProps.noResize"
        :value="variableValue"
        :rules="rules"
        @input="updateVariableValue">
    </v-textarea>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {AppWidget, PageVariable} from "@/lib/types";
import * as widget from "@/lib/widget";

export default Vue.extend({
  name: 'WidgetTextArea',
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
    variableValue(): string | undefined {
      if (this.variable && this.initialized) {
        return this.variable.value
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
    }
  },
  beforeMount() {
    if (!this.initialized) {
      const intialValue = widget.getConstAndVarValue(
          undefined,
          undefined,
          (this.variables as PageVariable[]),
          Number(this.dataProps.initalPageVarId),
          this.$route.params,
          this.dataProps.initalParamVarId
      )

      this.updateVariableValue(intialValue)
      this.initialized = true
    }
  }
})
</script>

<style scoped>

</style>