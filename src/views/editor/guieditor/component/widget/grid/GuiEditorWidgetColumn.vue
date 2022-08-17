<template>
  <v-col
      :cols="argsProps.cols ? Number(argsProps.cols) : ''"
      class="editor--grid editor--column pa-0 pb-4"
      @drop.self="onDrop"
      @click.self="setActive(appWidget)"
      @dragover.prevent
      @dragenter.prevent
      @click.prevent>

    <GuiEditorGridWidgetHeader :widget="widget" @activewidget="setActive" @move="move"/>

    <template v-for="(child) in appWidget.children">
      <GuiEditorWidget class="mr-2 ml-2 mb-2" :widget="child" :key="child.name" @activewidget="setActive" @move="move"/>
    </template>
  </v-col>
</template>

<script lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import Vue from "vue";
import GuiEditorGridWidgetHeader from "@/views/editor/guieditor/component/widget/grid/GuiEditorGridWidgetHeader.vue";
import {AppWidget, AppWidgetProp} from "@/lib/types";
import {getArgsProps} from "@/lib/widget";

export default Vue.extend({
  name: 'GuiEditorWidgetColumn',
  components: {
    GuiEditorGridWidgetHeader,
    GuiEditorWidget: () => import( "@/views/editor/guieditor/component/widget/GuiEditorWidget.vue"),
  },
  props: {
    widget: Object
  },
  data() {
    return {
      column: {children: []}
    }
  },
  computed: {
    appWidget(): AppWidget {
      return this.widget as AppWidget
    },
    argsProps(): { [k: string]: string } {
      return getArgsProps(this.appWidget)
    }
  },
  methods: {
    onDrop(evt?: DragEvent): void {
      const dataTransfer = evt?.dataTransfer;

      if (dataTransfer != null) {
        // eslint-disable-next-line
        const widget = JSON.parse(dataTransfer!.getData('widget'));
        (this.column.children as AppWidgetProp[]).push(widget);
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
    this.column = this.widget
  }
})
</script>

<style scoped>

</style>