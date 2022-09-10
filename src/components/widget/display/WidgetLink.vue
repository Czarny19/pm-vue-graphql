<template>
  <a :style="cssProps" :href="linkValue" target="_blank" v-if="visible">{{ labelValue }}</a>
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
    data(): never {
      return this.dataItem as never;
    },
    labelValue(): string {
      const data = this.data
      const queryFieldName = this.dataProps.labelQueryFieldName;

      const variables = this.variables as PageVariable[];
      const pageVarId = Number(this.dataProps.labelPageVarId);

      const params = this.$route.params;
      const pageParamName = this.dataProps.labelPageParamName;

      return widget.getDisplayWidgetVarValue(data, queryFieldName, variables, pageVarId, params, pageParamName);
    },
    linkValue(): string {
      const data = this.data;
      const queryFieldName = this.dataProps.linkQueryFieldName;

      const variables = this.variables as PageVariable[];
      const pageVarId = Number(this.dataProps.linkPageVarId);

      const params = this.$route.params;
      const pageParamName = this.dataProps.linkPageParamName;

      const link = widget.getDisplayWidgetVarValue(data, queryFieldName, variables, pageVarId, params, pageParamName);

      return link ? link : this.labelValue;
    }
  }
})
</script>

<style scoped>

</style>