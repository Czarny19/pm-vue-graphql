<template>
  <v-container fluid :style="cssProps" v-if="visible">
    <template v-for="(child) in widget.children">
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
          @savingdone="savingDone">
      </BaseWidget>
    </template>
  </v-container>
</template>

<script lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import Vue from "vue";
import * as widget from "@/lib/widget";
import {getCssProps} from "@/lib/widget";
import {AppWidget} from "@/lib/types";

export default Vue.extend({
  name: 'WidgetContainer',
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
      return this.widget as AppWidget
    },
    visible(): boolean {
      return widget.isWidgetVisible(this.appWidget, this.dataItem)
    },
    cssProps(): ({ [p: string]: string })[] {
      return getCssProps(this.appWidget, this.theme)
    }
  },
  methods: {
    showError(error: string) {
      this.$emit('showerror', error)
    },
    saving(): void {
      this.$emit('saving')
    },
    savingDone(): void {
      this.$emit('savingdone')
    }
  }
})
</script>

<style scoped>

</style>