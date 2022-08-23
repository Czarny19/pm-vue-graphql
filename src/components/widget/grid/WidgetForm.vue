<template>
  <v-form :style="cssProps">
    <template v-for="(child) in appWidget.children">
      <BaseWidget
          :widget="child"
          :theme="theme"
          :datasource="datasource"
          :key="child.name"
          :data-item="dataItem"
          :variables="variables">
      </BaseWidget>
    </template>
  </v-form>
</template>

<script lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import Vue from "vue";
import {AppWidget} from "@/lib/types";
import {getCssProps} from "@/lib/widget";

export default Vue.extend({
  name: 'WidgetForm',
  components: {BaseWidget: () => import("@/components/widget/BaseWidget.vue")},
  props: {
    widget: Object,
    theme: Object,
    datasource: Object,
    dataItem: Object,
    variables: Array
  },
  computed: {
    appWidget(): AppWidget {
      return this.widget as AppWidget
    },
    cssProps(): ({ [p: string]: string })[] {
      return getCssProps(this.appWidget, this.theme)
    }
  }
})
</script>

<style scoped>

</style>