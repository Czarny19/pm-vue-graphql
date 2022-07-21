<template>
  <div class="canvas__editor--element">
    <CanvasWidgetHeader :widget="widget" @activewidget="setActive" @move="move"/>

    <v-text-field
        class="canvas__editor--element"
        :label="widget.id"
        @click.self="setActive(appWidget)">
    </v-text-field>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import CanvasWidgetHeader from "@/views/canvas/component/editor/widget/CanvasWidgetHeader.vue";
import {AppWidget} from "@/plugins/types";
import {getArgsProps} from "@/plugins/widget";

export default Vue.extend({
  name: 'CanvasWidgetTextField',
  components: {CanvasWidgetHeader},
  props: {widget: Object},
  computed: {
    appWidget(): AppWidget {
      return this.widget as AppWidget
    },
    argsProps(): { [k: string]: string } {
      return getArgsProps(this.appWidget)
    }
  },
  methods: {
    setActive(widget: AppWidget) {
      this.$emit('activewidget', widget)
    },
    move(up: boolean): void {
      this.$emit('move', up)
    }
  }
})
</script>

<style scoped>

</style>