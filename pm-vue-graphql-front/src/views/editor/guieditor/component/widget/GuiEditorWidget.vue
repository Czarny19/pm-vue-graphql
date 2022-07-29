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

  <GuiEditorWidgetText
      v-else-if="widget.type === 'Text'"
      :widget="widget"
      @activewidget="setActive"
      @move="move">
  </GuiEditorWidgetText>

  <GuiEditorWidgetTextField
      v-else-if="widget.type === 'Text-Field'"
      :widget="widget"
      @activewidget="setActive"
      @move="move">
  </GuiEditorWidgetTextField>

  <GuiEditorWidgetTable
      v-else-if="widget.type === 'Table'"
      :widget="widget"
      @activewidget="setActive"
      @move="move">
  </GuiEditorWidgetTable>
</template>

<script lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import Vue from "vue";
import GuiEditorWidgetContainer from "@/views/editor/guieditor/component/widget/GuiEditorWidgetContainer.vue";
import GuiEditorWidgetRow from "@/views/editor/guieditor/component/widget/GuiEditorWidgetRow.vue";
import GuiEditorWidgetColumn from "@/views/editor/guieditor/component/widget/GuiEditorWidgetColumn.vue";
import GuiEditorWidgetText from "@/views/editor/guieditor/component/widget/GuiEditorWidgetText.vue";
import GuiEditorWidgetTextField from "@/views/editor/guieditor/component/widget/GuiEditorWidgetTextField.vue";
import GuiEditorWidgetTable from "@/views/editor/guieditor/component/widget/GuiEditorWidgetTable.vue";
import {AppWidget} from "@/plugins/types";

export default Vue.extend({
  name: 'GuiEditorWidget',
  components: {
    GuiEditorWidgetTable,
    GuiEditorWidgetContainer,
    GuiEditorWidgetRow,
    GuiEditorWidgetColumn,
    GuiEditorWidgetText,
    GuiEditorWidgetTextField,
  },
  props: {widget: Object},
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