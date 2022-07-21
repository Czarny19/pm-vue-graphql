<template>
  <WidgetContainer v-if="widget.type === 'Container'" :widget="widget" :theme="theme"/>
  <WidgetRow v-else-if="widget.type === 'Row'" :widget="widget" :theme="theme"/>
  <WidgetColumn v-else-if="widget.type === 'Column'" :widget="widget" :theme="theme"/>
  <WidgetText v-else-if="widget.type === 'Text'" :widget="widget" :theme="theme"/>
  <WidgetTextField v-else-if="widget.type === 'Text-Field'" :widget="widget" :theme="theme"/>
</template>

<script lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import Vue from "vue";
import WidgetContainer from "@/components/widget/WidgetContainer.vue";
import WidgetRow from "@/components/widget/WidgetRow.vue";
import WidgetColumn from "@/components/widget/WidgetColumn.vue";
import WidgetText from "@/components/widget/WidgetText.vue";
import WidgetTextField from "@/components/widget/WidgetTextField.vue";

export default Vue.extend({
  name: 'BaseWidget',
  components: {
    WidgetTextField,
    WidgetText,
    WidgetColumn,
    WidgetRow,
    WidgetContainer,
  },
  props: {
    widget: Object,
    theme: Object
  }
})
</script>

<style scoped>

</style>