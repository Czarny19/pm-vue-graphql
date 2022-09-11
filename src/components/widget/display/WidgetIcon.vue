<template>
  <v-icon :style="cssProps" v-if="visible">{{ argsProps.iconName }}</v-icon>
</template>

<script lang="ts">
import Vue from "vue";
import {AppWidget} from "@/lib/types";
import * as widget from "@/lib/widget";

export default Vue.extend({
  name: 'WidgetIcon',
  props: {
    widget: Object,
    dataItem: Object,
    theme: Object
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
    }
  }
})
</script>

<style scoped>

</style>