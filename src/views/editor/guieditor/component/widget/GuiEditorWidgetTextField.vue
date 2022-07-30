<template>
  <div class="editor--element mb-4" @click="setActive(appWidget)">
    <GuiEditorWidgetHeader :widget="widget" @activewidget="setActive" @move="move"/>

    <v-text-field
        :label="widget.id"
        @click="setActive(appWidget)">
    </v-text-field>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import GuiEditorWidgetHeader from "@/views/editor/guieditor/component/widget/GuiEditorWidgetHeader.vue";
import {AppWidget} from "@/lib/types";
import {getArgsProps} from "@/lib/widget";

export default Vue.extend({
  name: 'GuiEditorWidgetTextField',
  components: {GuiEditorWidgetHeader},
  props: {widget: Object},
  computed: {
    appWidget(): AppWidget {
      return this.widget as AppWidget
    },
    argsProps(): { [k: string]: string } {
      return getArgsProps(this.appWidget)
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