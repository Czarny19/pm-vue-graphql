<template>
  <v-container class="canvas__editor--display">
    <CanvasWidgetHolder :name="pageDefinition.id">
      <template v-slot:widget>
        <Widget :widget="pageDefinition" @setActive="setActive"/>
      </template>
    </CanvasWidgetHolder>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Widget from "@/components/widget/CanvasWidget.vue";
import CanvasWidgetHolder from "@/views/canvas/component/editor/display/CanvasWidgetHolder.vue";
import {AppWidget} from "@/plugins/types";

export default Vue.extend({
  name: 'CanvasEditorDisplay',
  components: {CanvasWidgetHolder, Widget},
  props: {
    projectName: String,
    pageDefinition: Object
  },
  methods: {
    setActive(widget: AppWidget) {
      this.$emit('activewidget', widget)
    }
  }
})
</script>

<style scoped>

</style>