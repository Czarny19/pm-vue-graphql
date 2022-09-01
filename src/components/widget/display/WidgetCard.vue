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

      <v-btn v-if="argsProps.action2Label" text :color="action2Color" @click="action2">
        {{ argsProps.action2Label }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import {AppWidget, PageVariable} from "@/lib/types";
import * as widget from "@/lib/widget";

export default Vue.extend({
  name: 'WidgetCard',
  props: {
    widget: Object,
    theme: Object,
    dataItem: Object,
    variables: Array
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
      return widget.getConstAndVarValue(
          this.data,
          this.dataProps.titleQueryVarId,
          (this.variables as PageVariable[]),
          Number(this.dataProps.titlePageVarId),
          this.$route.params,
          this.dataProps.titleParamVarId
      )
    },
    titleColor(): string {
      return widget.getColorPropValue(this.theme, this.argsProps.titleColor)
    },
    subtitle(): string {
      return widget.getConstAndVarValue(
          this.data,
          this.dataProps.subtitleQueryVarId,
          (this.variables as PageVariable[]),
          Number(this.dataProps.subtitlePageVarId),
          this.$route.params,
          this.dataProps.subtitleParamVarId
      )
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
      return widget.getConstAndVarValue(
          this.data,
          this.dataProps.textQueryVarId,
          (this.variables as PageVariable[]),
          Number(this.dataProps.textPageVarId),
          this.$route.params,
          this.dataProps.textParamVarId
      )
    },
    elevation(): number {
      return Number(this.argsProps.elevation)
    }
  },
  methods: {
    action1(): void {
      if (!this.$route.path.startsWith('/admin')) {
        widget.runWidgetClickAction(
            this.appWidget,
            this.$route.params.projectId,
            this.dataItem,
            (this.variables as PageVariable[]),
            1
        )
      }
    },
    action2(): void {
      if (!this.$route.path.startsWith('/admin')) {
        widget.runWidgetClickAction(
            this.appWidget,
            this.$route.params.projectId,
            this.dataItem,
            (this.variables as PageVariable[]),
            2
        )
      }
    }
  }
})
</script>

<style scoped>

</style>