<template>
  <div :style="cssProps" v-if="visible">
    <v-text-field
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
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {AppWidget, PageVariable} from "@/lib/types";
import * as widget from "@/lib/widget";

export default Vue.extend({
  name: 'WidgetTextField',
  props: {
    widget: Object,
    theme: Object,
    dataItem: Object,
    variables: Array
  },
  computed: {
    appWidget(): AppWidget {
      return this.widget as AppWidget;
    },
    visible(): boolean {
      return widget.isWidgetVisible(this.appWidget, this.dataItem);
    },
    cssProps(): ({ [p: string]: string })[] {
      return widget.getCssProps(this.appWidget, this.theme);
    },
    argsProps(): { [k: string]: string } {
      return widget.getArgsProps(this.appWidget);
    },
    dataProps(): { [k: string]: string } {
      return widget.getDataProps(this.appWidget);
    },
    counter(): number | undefined {
      return this.argsProps.counter ? Number(this.argsProps.counterNum) : undefined;
    },
    color(): string {
      return widget.getColorPropValue(this.theme, this.argsProps.color);
    },
    bgColor(): string {
      return widget.getColorPropValue(this.theme, this.argsProps.bgColor);
    },
    label(): string {
      return widget.getPageVariableValue(this.variables as PageVariable[], Number(this.argsProps.label));
    },
    hint(): string {
      return widget.getPageVariableValue(this.variables as PageVariable[], Number(this.argsProps.hint));
    },
    variable(): PageVariable | undefined {
      if (this.dataProps.variableId) {
        const variableId = Number(this.dataProps.variableId);
        return (this.variables as PageVariable[])?.find((variable) => variable.id === variableId);
      }

      return undefined;
    },
    variableValue(): string | undefined {
      if (this.variable) {
        return this.variable.value;
      }

      return undefined;
    },
    rules(): unknown[] {
      return widget.getRulesForInput(this.appWidget, this.counter);
    },
    data(): never {
      return this.dataItem as never;
    }
  },
  methods: {
    updateVariableValue(val: string): void {
      if (this.variable) {
        this.variable.value = val;
      }
    }
  },
  watch: {
    dataItem: {
      handler() {
        const data = this.data;
        const queryFieldName = this.dataProps.initialQueryFieldName;

        const variables = this.variables as PageVariable[];
        const pageVarId = Number(this.dataProps.initialPageVarId);

        const params = this.$route.params;
        const paramName = this.dataProps.initialParamName;

        const intialValue = widget.getWidgetVarValue(data, queryFieldName, variables, pageVarId, params, paramName);

        this.updateVariableValue(intialValue);
      },
      deep: true
    }
  },
  beforeMount() {
    const data = this.data;
    const queryFieldName = this.dataProps.initialQueryFieldName;

    const variables = this.variables as PageVariable[];
    const pageVarId = Number(this.dataProps.initialPageVarId);

    const params = this.$route.params;
    const paramName = this.dataProps.initialParamName;

    const intialValue = widget.getWidgetVarValue(data, queryFieldName, variables, pageVarId, params, paramName);

    this.updateVariableValue(intialValue);
  }
})
</script>

<style scoped>

</style>