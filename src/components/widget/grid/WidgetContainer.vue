<template>
  <v-container fluid :style="cssProps" v-if="visible">
    <BaseWidget
        v-for="(child) in widget.children"
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
      return this.widget as AppWidget;
    },
    visible(): boolean {
      return widget.isWidgetVisible(this.appWidget, this.dataItem);
    },
    argsProps(): { [k: string]: string } {
      return widget.getArgsProps(this.appWidget);
    },
    cssProps(): ({ [p: string]: string })[] {
      const props = getCssProps(this.appWidget, this.theme);

      if (this.argsProps.shadow) {
        const color = widget.getColorPropValue(this.theme, this.argsProps.shadowColor);

        props.push(
            {'box-shadow': `0px 0px 10px 0px ${color}`},
            {'-webkit-box-shadow': `0px 0px 10px 0px ${color}`},
            {'-moz-box-shadow': `0px 0px 10px 0px ${color}`}
        );
      }

      if (this.argsProps.rounded) {
        props.push({'border-radius': '10px'});
      }

      return props;
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