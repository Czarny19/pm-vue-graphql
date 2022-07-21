<template>
  <v-container fluid :style="cssProps">
    <template v-for="(child) in widget.children">
      <BaseWidget class="ma-3" :widget="child" :theme="theme" :key="child.name"/>
    </template>
  </v-container>
</template>

<script lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import Vue from "vue";
import {getCssProps} from "@/plugins/widget";
import {AppWidget} from "@/plugins/types";

export default Vue.extend({
  name: 'WidgetContainer',
  components: {BaseWidget: () => import("@/components/widget/BaseWidget.vue")},
  props: {
    widget: Object,
    theme: Object
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