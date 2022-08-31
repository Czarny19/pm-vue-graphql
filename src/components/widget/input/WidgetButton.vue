<template>
  <div :style="cssProps">
    <v-btn
        light
        :color="color"
        :disabled="argsProps.disabled"
        :block="argsProps.block"
        :depressed="argsProps.depressed"
        :outlined="argsProps.outlined"
        :rounded="argsProps.rounded"
        :text="argsProps.text"
        :x-small="argsProps.size === 'x-small'"
        :small="argsProps.size === 'small'"
        :large="argsProps.size === 'large'"
        :x-large="argsProps.size === 'x-large'"
        @click="click">
      {{ argsProps.label }}
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {AppWidget} from "@/lib/types";
import * as widget from "@/lib/widget";

export default Vue.extend({
  name: 'WidgetButton',
  props: {
    widget: Object,
    theme: Object,
    variables: Array,
    formValid: Boolean,
    formRef: Object
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
    color(): string {
      return widget.getColorPropValue(this.theme, this.argsProps.color)
    }
  },
  methods: {
    click(): void {
      console.log(this.formValid);
      console.log(this.formRef);
    }
  }
})
</script>

<style scoped>

</style>