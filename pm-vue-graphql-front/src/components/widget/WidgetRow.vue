<template>
  <v-row no-gutters :style="cssProps">
    <template v-for="(child) in widget.children">
      <BaseWidget :widget="child" :theme="theme" :key="child.name"/>
    </template>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import {AppWidget} from "@/plugins/types";
import {getCssProps} from "@/plugins/widget";

export default Vue.extend({
  name: 'WidgetRow',
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