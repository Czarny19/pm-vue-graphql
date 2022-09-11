<template>
  <div
      class="editor--grid editor--container pa-0 mb-2 pb-8"
      draggable="true"
      @click.self="setActive(appWidget)"
      @click.prevent
      @dragstart="startDrag($event)"
      @dragend="endDrag"
      @dragover.prevent
      @dragenter.prevent
  >
    <v-container fluid class="pa-0">

      <GuiEditorGridWidgetHeader :widget="widget" @activewidget="setActive"/>

      <GuiEditorWidgetDropBox
          class="ma-2"
          :drag="drag && !widget.move"
          @eldrop="(evt) => onDrop(0, evt)"
      />

      <template v-for="(child, index) in widget.children">
        <GuiEditorWidget
            class="ma-2 mt-4 mb-4"
            :page="page"
            :widget="child"
            :key="child.name"
            :drag="drag && !widget.move"
            @activewidget="setActive"
            @dragstarted="startChildDrag(index)"
            @dragended="endChildDrag"
        />

        <GuiEditorWidgetDropBox
            class="ma-2"
            :key="index"
            :drag="drag && !widget.move"
            @eldrop="(evt) => onDrop(index + 1, evt)"
        />
      </template>

    </v-container>
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import Vue from "vue";
import GuiEditorGridWidgetHeader from "@/views/editor/guieditor/component/widget/grid/GuiEditorGridWidgetHeader.vue";
import GuiEditorWidgetDropBox from "@/views/editor/guieditor/component/widget/GuiEditorWidgetDropBox.vue";
import {AppWidget, AppWidgetProp} from "@/lib/types";

export default Vue.extend({
  name: 'GuiEditorWidgetContainer',
  components: {
    GuiEditorWidgetDropBox,
    GuiEditorGridWidgetHeader,
    GuiEditorWidget: () => import("@/views/editor/guieditor/component/widget/GuiEditorWidget.vue"),
  },
  props: {
    page: Object,
    widget: Object,
    drag: Boolean
  },
  data() {
    return {
      container: {children: []},
      dragIndex: -1
    }
  },
  computed: {
    appWidget(): AppWidget {
      return this.widget as AppWidget;
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
        (this.container as AppWidget).move = true;
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
      (this.container as AppWidget).move = false;
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
        (this.container.children as AppWidgetProp[]).splice(index, 0, widget);
      }
    },
    removeWidgetFromTree(parent: AppWidget, widget: AppWidget) {
      for (const child of parent.children) {
        const index = parent.children.indexOf(child);

        if ((child as AppWidget).move) {
          parent.children.splice(index, 1);
          widget.move = false;
          return;
        }

        this.removeWidgetFromTree(child, widget);
      }
    },
    isThisLayerWidgetMoved(): boolean {
      return this.container.children.find((child) => (child as AppWidget).move) !== undefined;
    }
  },
  watch: {
    widget: {
      handler() {
        this.container = this.widget;
      },
      deep: true
    }
  },
  beforeMount() {
    this.container = this.widget;
  }
})
</script>

<style scoped>

</style>