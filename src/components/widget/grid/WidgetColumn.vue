<template>
  <v-col ref="col" v-if="visible" :cols="cols" :style="cssProps" style="text-align: start">
    <template v-for="(child) in appWidget.children">
      <BaseWidget
          :widget="child"
          :theme="theme"
          :datasource="datasource"
          :key="child.name"
          :data-item="dataItem"
          :variables="variables"
          :mutations="mutations"
          @showerror="showError"
          @saving="saving"
          @savingdone="savingDone"
      />
    </template>
  </v-col>
</template>

<script lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import Vue from "vue";
import {AppWidget} from "@/lib/types";
import * as widget from "@/lib/widget";

export default Vue.extend({
  name: 'WidgetColumn',
  components: {BaseWidget: () => import("@/components/widget/BaseWidget.vue")},
  props: {
    widget: Object,
    theme: Object,
    datasource: Object,
    dataItem: Object,
    variables: Array,
    mutations: Array
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
    cols(): string | number {
      return this.argsProps.cols ? Number(this.argsProps.cols) : '';
    }
  },
  methods: {
    showError(error: string) {
      this.$emit('showerror', error);
    },
    saving(): void {
      this.$emit('saving');
    },
    savingDone(): void {
      this.$emit('savingdone');
    }
  }
})
</script>

<style scoped>

</style>