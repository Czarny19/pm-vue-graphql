<template>
  <div :style="cssProps">{{ displayValue }}</div>
</template>

<script lang="ts">
import Vue from "vue";
import {AppWidget} from "@/lib/types";
import {getArgsProps, getCssProps, getDataProps} from "@/lib/widget";

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
      return getCssProps(this.appWidget, this.theme)
    },
    argsProps(): { [k: string]: string } {
      return getArgsProps(this.appWidget)
    },
    dataProps(): { [k: string]: string } {
      return getDataProps(this.appWidget)
    },
    displayValue(): string {
      return this.argsProps.text ? this.argsProps.text : '' +
      this.dataItem && this.dataProps.queryVarId ? this.dataItem[this.dataProps.queryVarId] : ''
    }
  }
})
</script>

<style scoped>

</style>