<template>
  <div class="pa-2 accent" @drop.self="onDrop" @dragover.prevent @dragenter.prevent @click.prevent>
    <template v-for="(child) in widget.children">
      <CanvasWidget :widget="child" :key="child.name" @activewidget="setActive" @move="move"/>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {AppWidget, AppWidgetProp} from "@/plugins/types";

export default Vue.extend({
  name: 'CanvasWidgetPage',
  components: {CanvasWidget: () => import("@/views/canvas/component/editor/widget/CanvasWidget.vue")},
  props: {widget: Object},
  data() {
    return {
      page: {children: []}
    }
  },
  methods: {
    onDrop(evt?: DragEvent) {
      const dataTransfer = evt?.dataTransfer;

      if (dataTransfer != null) {
        // eslint-disable-next-line
        const widget = dataTransfer!.getData('widget');
        (this.page.children as AppWidgetProp[]).push(JSON.parse(widget));
      }
    },
    setActive(widget: AppWidget) {
      this.$emit('activewidget', widget)
    },
    move(up: boolean): void {
      this.$emit('move', up)
    }
  },
  beforeMount() {
    this.page = this.widget
  }
})
</script>

<style scoped>

</style>