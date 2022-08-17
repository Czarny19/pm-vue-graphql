<template>
  <GuiEditorWidgetContainer
      v-if="widget.type === 'Container'"
      :widget="widget"
      @activewidget="setActive"
      @move="move">
  </GuiEditorWidgetContainer>

  <GuiEditorWidgetRow
      v-else-if="widget.type === 'Row'"
      :widget="widget"
      @activewidget="setActive"
      @move="move">
  </GuiEditorWidgetRow>

  <GuiEditorWidgetColumn
      v-else-if="widget.type === 'Column'"
      :widget="widget"
      @activewidget="setActive"
      @move="move">
  </GuiEditorWidgetColumn>

  <GuiEditorWidgetOther
      v-else
      :widget="widget"
      @activewidget="setActive"
      @move="move">
  </GuiEditorWidgetOther>
</template>

<script lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import Vue from "vue";
import GuiEditorWidgetContainer from "@/views/editor/guieditor/component/widget/grid/GuiEditorWidgetContainer.vue";
import GuiEditorWidgetRow from "@/views/editor/guieditor/component/widget/grid/GuiEditorWidgetRow.vue";
import GuiEditorWidgetColumn from "@/views/editor/guieditor/component/widget/grid/GuiEditorWidgetColumn.vue";
import GuiEditorWidgetOther from "@/views/editor/guieditor/component/widget/GuiEditorWidgetOther.vue";
import {AppWidget} from "@/lib/types";

export default Vue.extend({
  name: 'GuiEditorWidget',
  components: {GuiEditorWidgetOther, GuiEditorWidgetContainer, GuiEditorWidgetRow, GuiEditorWidgetColumn},
  props: {
    widget: Object
  },
  methods: {
    setActive(widget: AppWidget): void {
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