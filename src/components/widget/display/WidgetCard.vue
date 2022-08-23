<template>
  <v-card :style="cssProps" :color="cardColor" :outlined="outlined" :elevation="elevation" :shaped="shaped">
    <v-card-title v-if="title" class="text-h6" :style="{'color': titleColor}">
      {{ title }}
    </v-card-title>
    <v-card-subtitle v-if="subtitle" class="text-start text-body-1" :style="{'color': subtitleColor}">
      {{ subtitle }}
    </v-card-subtitle>
    <v-card-text v-if="text" class="text-start text-body-2" :style="{'color': textColor}">
      {{ text }}
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import {AppWidget} from "@/lib/types";
import {getArgsProps, getColorPropValue, getConstAndDataValue, getCssProps, getDataProps} from "@/lib/widget";

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
    data(): never {
      return this.dataItem as never
    },
    cardColor(): string {
      return getColorPropValue(this.theme, this.argsProps.background_color)
    },
    title(): string {
      return getConstAndDataValue(this.argsProps.title, this.data, this.dataProps.titleQueryVarId)
    },
    titleColor(): string {
      return getColorPropValue(this.theme, this.argsProps.title_color)
    },
    subtitle(): string {
      return getConstAndDataValue(this.argsProps.subtitle, this.data, this.dataProps.subtitleQueryVarId)
    },
    subtitleColor(): string {
      return getColorPropValue(this.theme, this.argsProps.subtitle_color)
    },
    text(): string {
      return getConstAndDataValue(this.argsProps.text, this.data, this.dataProps.textQueryVarId)
    },
    textColor(): string {
      return getColorPropValue(this.theme, this.argsProps.text_color)
    },
    outlined(): boolean {
      return Boolean(this.argsProps.outlined)
    },
    shaped(): boolean {
      return Boolean(this.argsProps.shaped)
    },
    elevation(): number {
      return Number(this.argsProps.elevation)
    }
  }
})
</script>

<style scoped>

</style>