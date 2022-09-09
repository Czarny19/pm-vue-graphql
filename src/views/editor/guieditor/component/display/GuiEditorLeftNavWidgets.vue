<template>
  <div>
    <div class="secondary text-start text-body-2 pa-3 pl-6">
      {{ label }}
    </div>

    <v-card
        v-for="(widget, index) in widgets"
        :key="index"
        class="editor--toolbox-widget ma-2 mb-3"
        draggable="true"
        elevation="0"
        color="primary"
        @dragstart="startDrag(widget, $event)"
        @dragend="leaveDrag">

      <v-container>
        <v-row>
          <v-col class="pa-0 ma-auto" cols="3">
            <v-icon>{{ widget.icon }}</v-icon>
          </v-col>

          <v-col class="pa-2 ma-auto text-start" cols="8">{{ widget.label }}</v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import lib from "@/lib/widgets.json";

export default Vue.extend({
  name: 'GuiEditorLeftNavWidgets',
  props: {
    label: String,
    widgets: Array
  },
  computed: {
    commonProps() {
      const common = JSON.parse(JSON.stringify(lib.widgets.filter((widget) => widget.type === 'Common')))[0]
      return common.propGroups
    }
  },
  methods: {
    startDrag(widget: { id: string }, evt?: DragEvent): void {
      this.$emit('dragstarted')

      const dataTransfer = evt?.dataTransfer;

      const widgetJSON = JSON.parse(JSON.stringify(widget))
      widgetJSON.propGroups.push(...this.commonProps)

      if (dataTransfer != null) {
        // eslint-disable-next-line
        dataTransfer!.dropEffect = 'move'
        // eslint-disable-next-line
        dataTransfer!.effectAllowed = 'move'
        // eslint-disable-next-line
        dataTransfer!.setData('widget', JSON.stringify(widgetJSON))
      }
    },
    leaveDrag(): void {
      this.$emit('dragended')
    }
  }
})
</script>

<style scoped>

</style>