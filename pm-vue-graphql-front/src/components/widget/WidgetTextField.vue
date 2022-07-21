<template>
  <v-text-field
      :label="widget.id">
  </v-text-field>
</template>

<script lang="ts">
import Vue from "vue";
import {AppWidget} from "@/plugins/types";
import {getArgsProps, getCssProps} from "@/plugins/widget";

export default Vue.extend({
  name: 'WidgetTextField',
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