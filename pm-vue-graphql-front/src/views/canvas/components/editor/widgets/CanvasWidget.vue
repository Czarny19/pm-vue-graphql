<template>
  <WidgetPage v-if="widget.title === 'Page'" :widget="widget" @setActive="setActive"/>
  <WidgetContainer v-else-if="widget.title === 'Container'" :widget="widget" @setActive="setActive"/>
  <WidgetRow v-else-if="widget.title === 'Row'" :widget="widget" @setActive="setActive"/>
  <WidgetColumn v-else-if="widget.title === 'Column'" :widget="widget" @setActive="setActive"/>
  <WidgetText v-else-if="widget.title === 'Text'" :widget="widget" @setActive="setActive"/>
  <WidgetTextField v-else-if="widget.title === 'Text-Field'" :widget="widget" @setActive="setActive"/>
</template>

<script>
import WidgetPage from "@/views/canvas/components/editor/widgets/WidgetPage";
import WidgetContainer from "@/views/canvas/components/editor/widgets/WidgetContainer";
import WidgetText from "@/views/canvas/components/editor/widgets/WidgetText";
import WidgetRow from "@/views/canvas/components/editor/widgets/WidgetRow";
import WidgetColumn from "@/views/canvas/components/editor/widgets/WidgetColumn";
import WidgetTextField from "@/views/canvas/components/editor/widgets/WidgetTextField";
import WidgetHelper from "@/views/canvas/components/editor/widgets/WidgetHelper";

export default {
  name: 'CanvasWidget',
  components: {WidgetTextField, WidgetColumn, WidgetRow, WidgetText, WidgetContainer, WidgetPage},
  mixins: [WidgetHelper],
  props: {
    widget: Object
  }
}
</script>

<style scoped>

</style>