<template>
  <v-card :style="cssProps">
    <v-card-title class="text-h6">
      {{ title }}
    </v-card-title>
    <v-card-subtitle class="text-start text-body-1">
      {{ subtitle }}
    </v-card-subtitle>
    <v-card-text class="text-start text-body-2">
      {{ text }}
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import {AppWidget} from "@/lib/types";
import {getArgsProps, getCssProps, getDataProps} from "@/lib/widget";

export default Vue.extend({
  name: 'WidgetCard',
  props: {
    widget: Object,
    theme: Object,
    dataItem: Object
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
    },
    dataProps(): { [k: string]: string } {
      return getDataProps(this.appWidget)
    },
    title(): string {
      return this.argsProps['title'] + this.dataItem ? this.dataItem[this.dataProps.titleQueryVarId] : ''
    },
    subtitle(): string {
      return this.argsProps['subtitle'] + this.dataItem ? this.dataItem[this.dataProps.subtitleQueryVarId] : ''
    },
    text(): string {
      return this.argsProps['text'] + this.dataItem ? this.dataItem[this.dataProps.textQueryVarId] : ''
    }
  }
})
</script>

<style scoped>

</style>