<template>
  <WidgetPage v-if="widget.title === 'Page'" :widget="widget" @setActive="setActive"/>
  <WidgetContainer v-else-if="widget.title === 'Container'" :widget="widget" @setActive="setActive"/>
  <WidgetRow v-else-if="widget.title === 'Row'" :widget="widget" @setActive="setActive"/>
  <WidgetColumn v-else-if="widget.title === 'Column'" :widget="widget" @setActive="setActive"/>
  <WidgetText v-else-if="widget.title === 'Text'" :widget="widget" @setActive="setActive"/>
  <WidgetTextField v-else-if="widget.title === 'Text-Field'" :widget="widget" @setActive="setActive"/>
</template>

<script>
import WidgetPage from "@/views/canvas/widgets/WidgetPage";
import WidgetContainer from "@/views/canvas/widgets/WidgetContainer";
import WidgetText from "@/views/canvas/widgets/WidgetText";
import WidgetRow from "@/views/canvas/widgets/WidgetRow";
import WidgetColumn from "@/views/canvas/widgets/WidgetColumn";
import WidgetTextField from "@/views/canvas/widgets/WidgetTextField";
import WidgetHelper from "@/views/canvas/widgets/WidgetHelper";

export default {
  name: 'Widget',
  components: {WidgetTextField, WidgetColumn, WidgetRow, WidgetText, WidgetContainer, WidgetPage},
  mixins: [WidgetHelper],
  props: {
    widget: Object
  }
}
</script>

<style scoped>

</style>