<template>
  <v-text-field
      class="canvas__editor--element"
      :label="widget.id"
      @click.self="setActive(appWidget)"
      :style="cssProps">
  </v-text-field>
</template>

<script lang="ts">
import Vue from "vue";
import {AppWidget} from "@/plugins/types";
import {getArgsProps, getCssProps} from "@/views/canvas/component/editor/widget/canvas-widget";

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