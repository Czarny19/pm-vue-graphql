<template>
  <div class="canvas__editor--element" :style="cssProps" @click.self="setActive(appWidget)">{{ argsProps.text }}</div>
</template>

<script lang="ts">
import Vue from "vue";
import {AppWidget} from "@/plugins/types";
import {getArgsProps, getCssProps} from "@/views/canvas/component/editor/widget/canvas-widget";

export default Vue.extend({
  name: 'WidgetText',
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
  },
  methods: {
    setActive(widget: AppWidget) {
      this.$emit('activewidget', widget)
    }
  }
})
</script>

<style scoped>

</style>