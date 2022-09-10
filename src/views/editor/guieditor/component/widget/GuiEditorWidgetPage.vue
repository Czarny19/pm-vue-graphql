<template>
  <div class="pa-2 pb-12 accent">

    <GuiEditorWidgetDropBox
        :drag="drag"
        :parent-widget="widget"
        @eldrop="(evt) => onDrop(0, evt)"
    />

    <template v-for="(child, index) in widget.children">
      <GuiEditorWidget
          :page="page"
          :widget="child"
          :key="child.name"
          :drag="drag"
          @activewidget="setActive"
          @dragstarted="dragStart(index)"
          @dragended="dragEnd"
      />

      <GuiEditorWidgetDropBox
          :key="index"
          :drag="drag"
          :parent-widget="widget"
          @eldrop="(evt) => onDrop(index + 1, evt)"
      />
    </template>

    <v-snackbar v-model="errorSnackbar" :timeout="6000">
      {{ i18n('editor.cannotPlaceWidgetInPage') }}

      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="errorSnackbar = false">
          {{ i18n('common.close') }}
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {AppWidget} from "@/lib/types";
import GuiEditorWidgetDropBox from "@/views/editor/guieditor/component/widget/GuiEditorWidgetDropBox.vue";

export default Vue.extend({
  name: 'GuiEditorWidgetPage',
  components: {
    GuiEditorWidgetDropBox,
    GuiEditorWidget: () => import("@/views/editor/guieditor/component/widget/GuiEditorWidget.vue")
  },
  props: {
    widget: Object,
    drag: Boolean
  },
  data() {
    return {
      page: {children: []},
      errorSnackbar: false,
      dragIndex: -1
    }
  },
  methods: {
    setActive(widget: AppWidget): void {
      this.$emit('activewidget', widget);
    },
    dragStart(index: number): void {
      this.dragIndex = index;
      this.$emit('dragstarted');
    },
    dragEnd(): void {
      this.dragIndex = -1;
      this.$emit('dragended');
    },
    onDrop(index: number, evt?: DragEvent) {
      this.$emit('dragended');

      const dataTransfer = evt?.dataTransfer;

      if (dataTransfer != null) {
        // eslint-disable-next-line
        const widget = JSON.parse(dataTransfer!.getData('widget'));

        if (widget.group === 'Grid' && widget.type !== 'Container') {
          this.errorSnackbar = true;
          return;
        }

        if (this.dragIndex >= 0 && this.dragIndex < index && this.isThisLayerWidgetMoved()) {
          index--;
        }

        this.dragIndex = -1;

        this.moveWidgets(this.page as AppWidget, widget);
        (this.page.children as AppWidget[]).splice(index, 0, widget);
      }
    },
    moveWidgets(parent: AppWidget, widget: AppWidget): void {
      for (const child of parent.children) {
        const index = parent.children.indexOf(child);

        if ((child as AppWidget).move) {
          widget.move = false;
          parent.children.splice(index, 1);
          continue;
        }

        this.moveWidgets(child, widget);
      }
    },
    isThisLayerWidgetMoved(): boolean {
      return this.page.children.find((child) => (child as AppWidget).move) !== undefined;
    }
  },
  beforeMount() {
    this.page = this.widget;
  }
})
</script>

<style scoped>

</style>