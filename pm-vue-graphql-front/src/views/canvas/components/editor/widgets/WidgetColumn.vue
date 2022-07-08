<template>
  <v-col
      class="canvas__editor--element"
      @drop.self="onDrop"
      @click.self="setActive(widget)"
      @dragover.prevent
      @dragenter.prevent
      @click.prevent>

    <template v-for="(child) in widget.children" >
      <CanvasWidget :widget="child" :key="child.name" @setActive="setActive"/>
    </template>

  </v-col>
</template>

<script>
import WidgetHelper from "@/views/canvas/components/editor/widgets/WidgetHelper";

export default {
  name: 'WidgetColumn',
  components: {CanvasWidget : () => import( "@/views/canvas/components/editor/widgets/CanvasWidget")},
  mixins: [WidgetHelper],
  data() {
    return {
      column: {children: []}
    }
  },
  methods: {
    onDrop(evt) {
      const widget = evt.dataTransfer.getData('widget')
      this.column.children.push(JSON.parse(widget))
    }
  },
  beforeMount() {
    this.column = this.widget
  }
}
</script>

<style scoped>

</style>