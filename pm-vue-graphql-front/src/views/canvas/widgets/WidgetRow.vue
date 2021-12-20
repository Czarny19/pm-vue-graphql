<template>
  <v-row
      class="canvas__editor--element"
      @drop.self="onDrop"
      @click.self="setActive(widget)"
      @dragover.prevent
      @dragenter.prevent
      @click.prevent>

    <template v-for="(child) in widget.children" >
      <Widget :widget="child" :key="child.name" @setActive="setActive"/>
    </template>

  </v-row>
</template>

<script>
import WidgetHelper from "@/views/canvas/widgets/WidgetHelper";

export default {
  name: 'WidgetRow',
  components: {Widget: () => import( "@/views/canvas/widgets/Widget")},
  mixins: [WidgetHelper],
  data() {
    return {
      row: {children: []}
    }
  },
  methods: {
    onDrop(evt) {
      const widget = evt.dataTransfer.getData('widget')
      this.row.children.push(JSON.parse(widget))
    }
  },
  beforeMount() {
    this.row = this.widget
  }
}
</script>

<style scoped>

</style>