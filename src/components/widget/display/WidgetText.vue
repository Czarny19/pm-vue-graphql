<template>
  <div :style="cssProps">{{ displayValue }}</div>
</template>

<script lang="ts">
import Vue from "vue";
import {AppWidget} from "@/lib/types";
import * as widget from "@/lib/widget";

export default Vue.extend({
  name: 'WidgetText',
  props: {
    widget: Object,
    theme: Object,
    dataItem: Object
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
      return widget.getConstAndDataValue(this.argsProps.text, this.data, this.dataProps.textQueryVarId)
    }
  }
})
</script>

<style scoped>

</style>