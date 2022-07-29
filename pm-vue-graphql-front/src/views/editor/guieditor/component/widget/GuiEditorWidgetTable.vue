<template>
  <div class="editor--element editor--text mb-4" @click="setActive(appWidget)">
    <GuiEditorWidgetHeader :widget="widget" @activewidget="setActive" @move="move"/>
    <v-data-table/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import GuiEditorWidgetHeader from "@/views/editor/guieditor/component/widget/GuiEditorWidgetHeader.vue";
import {AppWidget} from "@/plugins/types";

export default Vue.extend({
  name: 'GuiEditorWidgetTable',
  components: {GuiEditorWidgetHeader},
  props: {widget: Object},
  computed: {
    appWidget(): AppWidget {
      return this.widget as AppWidget
    }
  },
  methods: {
    setActive(widget: AppWidget) {
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