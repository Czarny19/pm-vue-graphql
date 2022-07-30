<template>
  <v-container fluid :style="cssProps">
    <template v-for="(child) in widget.children">
      <BaseWidget
          class="ma-3"
          :widget="child"
          :theme="theme"
          :datasource="datasource"
          :datasource-secret="datasourceSecret"
          :key="child.name">
      </BaseWidget>
    </template>
  </v-container>
</template>

<script lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import Vue from "vue";
import {getCssProps} from "@/lib/widget";
import {AppWidget} from "@/lib/types";

export default Vue.extend({
  name: 'WidgetContainer',
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
    }
  }
})
</script>

<style scoped>

</style>