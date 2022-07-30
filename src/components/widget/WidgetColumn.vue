<template>
  <v-col :cols="argsProps.cols ? Number(argsProps.cols) : ''" :style="cssProps">
    <template v-for="(child) in appWidget.children">
      <BaseWidget
          :widget="child"
          :theme="theme"
          :datasource="datasource"
          :datasource-secret="datasourceSecret"
          :key="child.name">
      </BaseWidget>
    </template>
  </v-col>
</template>

<script lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import Vue from "vue";
import {AppWidget} from "@/lib/types";
import {getArgsProps, getCssProps} from "@/lib/widget";

export default Vue.extend({
  name: 'WidgetColumn',
  components: {BaseWidget: () => import("@/components/widget/BaseWidget.vue")},
  props: {
    widget: Object,
    theme: Object,
    datasource: Object,
    datasourceSecret: String
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
    }
  },
})
</script>

<style scoped>

</style>