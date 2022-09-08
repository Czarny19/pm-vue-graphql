<template>
  <div :style="cssProps" v-if="visible">{{ displayValue }}</div>
</template>

<script lang="ts">
import Vue from "vue";
import {AppWidget, PageVariable} from "@/lib/types";
import * as widget from "@/lib/widget";

export default Vue.extend({
  name: 'WidgetText',
  props: {
    widget: Object,
    theme: Object,
    dataItem: Object,
    variables: Array
  },
  computed: {
    appWidget(): AppWidget {
      return this.widget as AppWidget
    },
    visible(): boolean {
      return widget.isWidgetVisible(this.appWidget, this.dataItem)
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
    data(): never {
      return this.dataItem as never
    },
    displayValue(): string {
      const data = this.data
      const queryFieldName = this.dataProps.textQueryFieldName

      const variables = this.variables as PageVariable[]
      const pageVarId = Number(this.dataProps.textPageVarId)

      const params = this.$route.params
      const pageParamName = this.dataProps.textPageParamName

      return widget.getDisplayWidgetVarValue(data, queryFieldName, variables, pageVarId, params, pageParamName)
    }
  }
})
</script>

<style scoped>

</style>