<template>
  <v-card
      :style="cssProps"
      :color="cardColor"
      :outlined="argsProps.outlined"
      :elevation="elevation"
      :shaped="argsProps.shaped">

    <v-card-title v-if="title" class="text-h6" :style="{'color': titleColor}">
      {{ title }}
    </v-card-title>
    <v-card-subtitle v-if="subtitle" class="text-start text-body-1" :style="{'color': subtitleColor}">
      {{ subtitle }}
    </v-card-subtitle>
    <v-card-text v-if="text" class="text-start text-body-1 pb-2" :style="{'color': textColor}">
      {{ text }}
    </v-card-text>

    <v-card-actions v-if="argsProps.action1Label || argsProps.action2Label">
      <v-btn v-if="argsProps.action1Label" text :color="action1Color" @click="action1">
        {{ argsProps.action1Label }}
      </v-btn>

      <v-btn v-if="argsProps.action2Label" text :color="action2Color">
        {{ argsProps.action2Label }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import {AppWidget} from "@/lib/types";
import * as widget from "@/lib/widget";

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
      return widget.getCssProps(this.appWidget, this.theme)
    },
    argsProps(): { [k: string]: string } {
      return widget.getArgsProps(this.appWidget)
    },
    dataProps(): { [k: string]: string } {
      return widget.getDataProps(this.appWidget)
    },
    data(): never {
      return this.dataItem as never
    },
    cardColor(): string {
      return widget.getColorPropValue(this.theme, this.argsProps.backgroundColor)
    },
    title(): string {
      return widget.getConstAndDataValue(this.argsProps.title, this.data, this.dataProps.titleQueryVarId)
    },
    titleColor(): string {
      return widget.getColorPropValue(this.theme, this.argsProps.titleColor)
    },
    subtitle(): string {
      return widget.getConstAndDataValue(this.argsProps.subtitle, this.data, this.dataProps.subtitleQueryVarId)
    },
    subtitleColor(): string {
      return widget.getColorPropValue(this.theme, this.argsProps.subtitleColor)
    },
    action1Color(): string {
      return widget.getColorPropValue(this.theme, this.argsProps.action1Color)
    },
    action2Color(): string {
      return widget.getColorPropValue(this.theme, this.argsProps.action2Color)
    },
    textColor(): string {
      return widget.getColorPropValue(this.theme, this.argsProps.textColor)
    },
    text(): string {
      return widget.getConstAndDataValue(this.argsProps.text, this.data, this.dataProps.textQueryVarId)
    },
    elevation(): number {
      return Number(this.argsProps.elevation)
    }
  },
  methods: {
    action1(): void {
      console.log('aaa')
    }
  }
})
</script>

<style scoped>

</style>