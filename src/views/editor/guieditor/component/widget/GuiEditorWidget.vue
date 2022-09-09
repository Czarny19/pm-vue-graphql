<template>
  <GuiEditorWidgetContainer
      v-if="widget.type === 'Container'"
      :page="page"
      :widget="widget"
      :drag="drag"
      @activewidget="setActive"
      @dragstarted="dragStart"
      @dragended="dragEnd"
  />

  <GuiEditorWidgetRow
      v-else-if="widget.type === 'Row'"
      :page="page"
      :widget="widget"
      :drag="drag"
      @activewidget="setActive"
      @dragstarted="dragStart"
      @dragended="dragEnd"
  />

  <GuiEditorWidgetColumn
      v-else-if="widget.type === 'Column'"
      :page="page"
      :widget="widget"
      :drag="drag"
      @activewidget="setActive"
      @dragstarted="dragStart"
      @dragended="dragEnd"
  />

  <GuiEditorWidgetForm
      v-else-if="widget.type === 'Form'"
      :page="page"
      :widget="widget"
      :drag="drag"
      @activewidget="setActive"
      @dragstarted="dragStart"
      @dragended="dragEnd"
  />

  <GuiEditorWidgetOther
      v-else
      :widget="widget"
      @activewidget="setActive"
      @dragstarted="dragStart"
      @dragended="dragEnd"
  />
</template>

<script lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import Vue from "vue";
import GuiEditorWidgetContainer from "@/views/editor/guieditor/component/widget/grid/GuiEditorWidgetContainer.vue";
import GuiEditorWidgetRow from "@/views/editor/guieditor/component/widget/grid/GuiEditorWidgetRow.vue";
import GuiEditorWidgetColumn from "@/views/editor/guieditor/component/widget/grid/GuiEditorWidgetColumn.vue";
import GuiEditorWidgetOther from "@/views/editor/guieditor/component/widget/grid/GuiEditorWidgetOther.vue";
import GuiEditorWidgetForm from "@/views/editor/guieditor/component/widget/grid/GuiEditorWidgetForm.vue";
import {AppWidget} from "@/lib/types";

export default Vue.extend({
  name: 'GuiEditorWidget',
  components: {
    GuiEditorWidgetForm,
    GuiEditorWidgetOther,
    GuiEditorWidgetContainer,
    GuiEditorWidgetRow,
    GuiEditorWidgetColumn
  },
  props: {
    page: Object,
    widget: Object,
    drag: Boolean
  },
  methods: {
    setActive(widget: AppWidget): void {
      this.$emit('activewidget', widget)
    },
    dragStart(): void {
      this.$emit('dragstarted')
    },
    dragEnd(): void {
      this.$emit('dragended')
    },
  }
})

</script>

<style scoped>

</style>