<template>
  <div :style="cssProps">{{ displayValue }}</div>
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
      return widget.getConstAndVarValue(
          this.data,
          this.dataProps.textQueryVarId,
          (this.variables as PageVariable[]),
          Number(this.dataProps.textPageVarId),
          this.$route.params,
          this.dataProps.textParamVarId
      )
    }
  }
})
</script>

<style scoped>

</style>