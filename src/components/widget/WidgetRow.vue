<template>
  <v-row no-gutters :style="cssProps">
    <template v-for="(child) in widget.children">
      <BaseWidget
          :widget="child"
          :theme="theme"
          :datasource="datasource"
          :datasource-secret="datasourceSecret"
          :key="child.name">
      </BaseWidget>
    </template>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import {AppWidget} from "@/lib/types";
import {getCssProps} from "@/lib/widget";

export default Vue.extend({
  name: 'WidgetRow',
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