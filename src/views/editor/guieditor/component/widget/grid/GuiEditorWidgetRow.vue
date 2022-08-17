<template>
  <v-row
      class="editor--grid editor--row pb-8"
      @drop.self="onDrop"
      @click.self="setActive(appWidget)"
      @dragover.prevent
      @dragenter.prevent
      @click.prevent>

    <GuiEditorGridWidgetHeader :widget="widget" @activewidget="setActive" @move="move"/>

    <template v-for="(child) in widget.children">
      <GuiEditorWidget :widget="child" :key="child.name" @activewidget="setActive" @move="move"/>
    </template>
  </v-row>
</template>

<script lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import Vue from "vue";
import GuiEditorGridWidgetHeader from "@/views/editor/guieditor/component/widget/grid/GuiEditorGridWidgetHeader.vue";
import {AppWidget, AppWidgetProp} from "@/lib/types";

export default Vue.extend({
  name: 'GuiEditorWidgetRow',
  components: {
    GuiEditorGridWidgetHeader,
    GuiEditorWidget: () => import( "@/views/editor/guieditor/component/widget/GuiEditorWidget.vue"),
  },
  props: {
    widget: Object
  },
  data() {
    return {
      row: {children: []}
    }
  },
  computed: {
    appWidget(): AppWidget {
      return this.widget as AppWidget
    }
  },
  methods: {
    onDrop(evt?: DragEvent): void {
      const dataTransfer = evt?.dataTransfer;

      if (dataTransfer != null) {
        // eslint-disable-next-line
        const widget = JSON.parse(dataTransfer!.getData('widget'));
        (this.row.children as AppWidgetProp[]).push(widget);
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
    this.row = this.widget
  }
})
</script>

<style scoped>

</style>