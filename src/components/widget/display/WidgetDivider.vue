<template>
  <v-divider :style="cssProps" :vertical="argsProps.vertical"></v-divider>
</template>

<script lang="ts">
import Vue from "vue";
import {AppWidget} from "@/lib/types";
import {getArgsProps, getCssProps} from "@/lib/widget";

export default Vue.extend({
  name: 'WidgetDivider',
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
    },
    argsProps(): { [k: string]: string } {
      return getArgsProps(this.appWidget)
    }
  }
})
</script>

<style scoped>

</style>