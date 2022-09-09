<template>
  <v-card
      class="mt-2 mb-2 pa-2 pl-3 text-start"
      color="secondary"
      draggable="true"
      @click="setActive(appWidget)"
      @dragstart="startDrag($event)"
      @dragend="endDrag">
    <span v-if="widget.id"> {{ appWidget.id }} :: {{ appWidget.label }}</span>
    <span v-else>{{ appWidget.label }}</span>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import {AppWidget} from "@/lib/types";

export default Vue.extend({
  name: 'GuiEditorWidgetOther',
  props: {
    widget: Object
  },
  data() {
    return {
      thisWidget: {}
    }
  },
  computed: {
    appWidget(): AppWidget {
      return this.widget as AppWidget
    }
  },
  methods: {
    setActive(widget: AppWidget): void {
      this.$emit('activewidget', widget)
    },
    startDrag(evt?: DragEvent): void {
      this.$emit('dragstarted')
      const dataTransfer = evt?.dataTransfer;

      if (dataTransfer != null) {
        (this.thisWidget as AppWidget).move = true;
        const widgetJSON = JSON.parse(JSON.stringify(this.thisWidget));

        // eslint-disable-next-line
        dataTransfer!.dropEffect = 'move'
        // eslint-disable-next-line
        dataTransfer!.effectAllowed = 'move'
        // eslint-disable-next-line
        dataTransfer!.setData('widget', JSON.stringify(widgetJSON))
      }
    },
    endDrag(): void {
      (this.thisWidget as AppWidget).move = false
      this.$emit('dragended')
    }
  },
  watch: {
    widget: {
      handler() {
        this.thisWidget = this.widget
      },
      deep: true
    }
  },
  beforeMount() {
    this.thisWidget = this.widget
  }
})
</script>

<style scoped>

</style>