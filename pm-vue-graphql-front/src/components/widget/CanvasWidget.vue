<template>
  <WidgetPage v-if="widget.type === 'Page'" :widget="widget" @setActive="setActive"/>
  <WidgetContainer v-else-if="widget.type === 'Container'" :widget="widget" @setActive="setActive"/>
  <WidgetRow v-else-if="widget.type === 'Row'" :widget="widget" @setActive="setActive"/>
  <WidgetColumn v-else-if="widget.type === 'Column'" :widget="widget" @setActive="setActive"/>
  <WidgetText v-else-if="widget.type === 'Text'" :widget="widget" @setActive="setActive"/>
  <WidgetTextField v-else-if="widget.type === 'Text-Field'" :widget="widget" @setActive="setActive"/>
</template>

<script>
import WidgetPage from "@/components/widget/WidgetPage";
import WidgetContainer from "@/components/widget/WidgetContainer";
import WidgetText from "@/components/widget/WidgetText";
import WidgetRow from "@/components/widget/WidgetRow";
import WidgetColumn from "@/components/widget/WidgetColumn";
import WidgetTextField from "@/components/widget/WidgetTextField";
import WidgetHelper from "@/components/widget/WidgetHelper";

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