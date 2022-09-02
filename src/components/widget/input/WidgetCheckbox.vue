<template>
  <div :style="cssProps">
    <v-checkbox
        v-if="initialized"
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