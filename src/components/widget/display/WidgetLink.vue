<template>
  <a :style="cssProps" :href="linkValue" target="_blank">{{ labelValue }}</a>
</template>

<script lang="ts">
import Vue from "vue";
import {AppWidget, PageVariable} from "@/lib/types";
import * as widget from "@/lib/widget";

export default Vue.extend({
  name: 'WidgetLink',
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
    labelValue(): string {
      return widget.getDisplayWidgetVarValue(
          this.data,
          this.dataProps.labelQueryVarId,
          (this.variables as PageVariable[]),
          Number(this.dataProps.labelPageVarId),
          this.$route.params,
          this.dataProps.labelParamVarId
      )
    },
    linkValue(): string {
      const link = widget.getDisplayWidgetVarValue(
          this.data,
          this.dataProps.linkQueryVarId,
          (this.variables as PageVariable[]),
          Number(this.dataProps.linkPageVarId),
          this.$route.params,
          this.dataProps.linkParamVarId
      )

      return link ? link : this.labelValue
    }
  }
})
</script>

<style scoped>

</style>