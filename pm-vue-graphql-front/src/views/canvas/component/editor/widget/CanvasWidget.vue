<template>
  <CanvasWidgetContainer
      v-if="widget.type === 'Container'"
      :widget="widget"
      @activewidget="setActive"
      @move="move">
  </CanvasWidgetContainer>

  <CanvasWidgetRow
      v-else-if="widget.type === 'Row'"
      :widget="widget"
      @activewidget="setActive"
      @move="move">
  </CanvasWidgetRow>

  <CanvasWidgetColumn
      v-else-if="widget.type === 'Column'"
      :widget="widget"
      @activewidget="setActive"
      @move="move">
  </CanvasWidgetColumn>

  <CanvasWidgetText
      v-else-if="widget.type === 'Text'"
      :widget="widget"
      @activewidget="setActive"
      @move="move">
  </CanvasWidgetText>

  <CanvasWidgetTextField
      v-else-if="widget.type === 'Text-Field'"
      :widget="widget"
      @activewidget="setActive"
      @move="move">
  </CanvasWidgetTextField>
</template>

<script lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import Vue from "vue";
import CanvasWidgetContainer from "@/views/canvas/component/editor/widget/CanvasWidgetContainer.vue";
import CanvasWidgetRow from "@/views/canvas/component/editor/widget/CanvasWidgetRow.vue";
import CanvasWidgetColumn from "@/views/canvas/component/editor/widget/CanvasWidgetColumn.vue";
import CanvasWidgetText from "@/views/canvas/component/editor/widget/CanvasWidgetText.vue";
import CanvasWidgetTextField from "@/views/canvas/component/editor/widget/CanvasWidgetTextField.vue";
import {AppWidget} from "@/plugins/types";

export default Vue.extend({
  name: 'CanvasWidget',
  components: {
    CanvasWidgetContainer,
    CanvasWidgetRow,
    CanvasWidgetColumn,
    CanvasWidgetTextField,
    CanvasWidgetText,
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