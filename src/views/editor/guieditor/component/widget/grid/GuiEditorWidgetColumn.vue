<template>
  <v-col
      class="editor--grid editor--column pa-0 pb-4"
      draggable="true"
      :cols="argsProps.cols ? Number(argsProps.cols) : ''"
      @click.self="setActive(appWidget)"
      @click.prevent
      @dragstart="startDrag($event)"
      @dragend="endDrag"
      @dragover.prevent
      @dragenter.prevent
  >
    <GuiEditorGridWidgetHeader :widget="widget" @activewidget="setActive"/>

    <GuiEditorWidgetDropBox
        :drag="drag && !widget.move"
        :parent-widget="widget"
        @eldrop="(evt) => onDrop(0, evt)"
    />

    <template v-for="(child, index) in appWidget.children">
      <GuiEditorWidget
          class="mr-2 ml-2 mb-2"
          :page="page"
          :widget="child"
          :drag="drag && !widget.move"
          :key="child.name"
          @activewidget="setActive"
          @dragstarted="startChildDrag(index)"
          @dragended="endChildDrag"
      />

      <GuiEditorWidgetDropBox
          :key="index"
          :drag="drag && !widget.move"
          :parent-widget="widget"
          @eldrop="(evt) => onDrop(index + 1, evt)"
      />
    </template>
  </v-col>
</template>

<script lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import Vue from "vue";
import GuiEditorGridWidgetHeader from "@/views/editor/guieditor/component/widget/grid/GuiEditorGridWidgetHeader.vue";
import GuiEditorWidgetDropBox from "@/views/editor/guieditor/component/widget/GuiEditorWidgetDropBox.vue";
import {AppWidget, AppWidgetProp} from "@/lib/types";
import {getArgsProps} from "@/lib/widget";

export default Vue.extend({
  name: 'GuiEditorWidgetColumn',
  components: {
    GuiEditorWidgetDropBox,
    GuiEditorGridWidgetHeader,
    GuiEditorWidget: () => import( "@/views/editor/guieditor/component/widget/GuiEditorWidget.vue"),
  },
  props: {
    page: Object,
    widget: Object,
    drag: Boolean
  },
  data() {
    return {
      column: {children: []},
      dragIndex: -1
    }
  },
  computed: {
    appWidget(): AppWidget {
      return this.widget as AppWidget;
    },
    argsProps(): { [k: string]: string } {
      return getArgsProps(this.appWidget);
    }
  },
  methods: {
    setActive(widget: AppWidget): void {
      this.$emit('activewidget', widget);
    },
    startDrag(evt?: DragEvent): void {
      this.$emit('dragstarted');

      const dataTransfer = evt?.dataTransfer;

      if (dataTransfer != null && !evt?.dataTransfer?.getData('widget')) {
        (this.column as AppWidget).move = true;
        const widgetJSON = JSON.parse(JSON.stringify(this.appWidget));

        // eslint-disable-next-line
        dataTransfer!.dropEffect = 'move';
        // eslint-disable-next-line
        dataTransfer!.effectAllowed = 'move';
        // eslint-disable-next-line
        dataTransfer!.setData('widget', JSON.stringify(widgetJSON));
      }
    },
    endDrag(): void {
      this.$emit('dragended');
      (this.column as AppWidget).move = false;
    },
    startChildDrag(index: number): void {
      this.$emit('dragstarted');
      this.dragIndex = index;
    },
    endChildDrag(): void {
      this.$emit('dragended');
      this.dragIndex = -1;
    },
    onDrop(index: number, evt?: DragEvent): void {
      this.$emit('dragended');

      const dataTransfer = evt?.dataTransfer;

      if (dataTransfer != null) {
        // eslint-disable-next-line
        const widget = JSON.parse(dataTransfer!.getData('widget'));

        if (this.dragIndex >= 0 && this.dragIndex < index && this.isThisLayerWidgetMoved()) {
          index--;
        }

        this.dragIndex = -1;

        this.removeWidgetFromTree(this.page, widget);
        (this.column.children as AppWidgetProp[]).splice(index, 0, widget);
      }
    },
    removeWidgetFromTree(parent: AppWidget, widget: AppWidget) {
      for (const child of parent.children) {
        const index = parent.children.indexOf(child);

        if ((child as AppWidget).move) {
          widget.move = false;
          parent.children.splice(index, 1);
          return;
        }

        this.removeWidgetFromTree(child, widget);
      }
    },
    isThisLayerWidgetMoved(): boolean {
      return this.column.children.find((child) => (child as AppWidget).move) !== undefined;
    }
  },
  watch: {
    widget: {
      handler() {
        this.column = this.widget;
      },
      deep: true
    }
  },
  beforeMount() {
    this.column = this.widget;
  }
})
</script>

<style scoped>

</style>