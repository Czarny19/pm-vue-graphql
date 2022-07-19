<template>
  <CanvasWidgetContainer v-if="widget.type === 'Container'" :widget="widget" :theme="theme" @activewidget="setActive"/>
  <CanvasWidgetRow v-else-if="widget.type === 'Row'" :widget="widget" @activewidget="setActive"/>
  <CanvasWidgetColumn v-else-if="widget.type === 'Column'" :widget="widget" @activewidget="setActive"/>
  <WidgetText v-else-if="widget.type === 'Text'" :widget="widget" @activewidget="setActive"/>
  <WidgetTextField v-else-if="widget.type === 'Text-Field'" :widget="widget" @activewidget="setActive"/>
</template>

<script lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import Vue from "vue";
import CanvasWidgetContainer from "@/views/canvas/component/editor/widget/CanvasWidgetContainer.vue";
import CanvasWidgetRow from "@/views/canvas/component/editor/widget/CanvasWidgetRow.vue";
import CanvasWidgetColumn from "@/views/canvas/component/editor/widget/CanvasWidgetColumn.vue";
import WidgetText from "@/views/canvas/component/editor/widget/WidgetText.vue";
import WidgetTextField from "@/views/canvas/component/editor/widget/WidgetTextField.vue";
import {AppWidget} from "@/plugins/types";

export default Vue.extend({
  name: 'CanvasWidget',
  components: {
    CanvasWidgetContainer,
    CanvasWidgetRow,
    CanvasWidgetColumn,
    WidgetTextField,
    WidgetText,
  },
  props: {
    widget: Object,
    theme: Object
  },
  methods: {
    setActive(widget: AppWidget): void {
      this.$emit('activewidget', widget)
    }
  },
})
</script>

<style scoped>

</style>