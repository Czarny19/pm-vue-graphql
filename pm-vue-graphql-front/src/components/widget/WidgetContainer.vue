<template>
  <v-container
      class="canvas__editor--element"
      @drop.self="onDrop"
      @click.self="setActive(widget)"
      @dragover.prevent
      @dragenter.prevent
      @click.prevent
      :style="cssPropsComputed">

    <template v-for="(child) in widget.children">
      <CanvasWidget :widget="child" :key="child.name" @setActive="setActive"/>
    </template>

  </v-container>
</template>

<script>
import WidgetHelper from "@/components/widget/WidgetHelper";

export default {
  name: 'WidgetContainer',
  components: {CanvasWidget: () => import( "@/components/widget/CanvasWidget")},
  mixins: [WidgetHelper],
  data() {
    return {
      container: {children: []}
    }
  },
  methods: {
    onDrop(evt) {
      const widget = evt.dataTransfer.getData('widget')
      this.container.children.push(JSON.parse(widget))
    }
  },
  beforeMount() {
    this.container = this.widget
  }
}
</script>

<style scoped>

</style>