<template>
  <div
      class="canvas__editor--element"
      @drop.self="onDrop"
      @click.self="setActive(widget)"
      @dragover.prevent
      @dragenter.prevent
      @click.prevent>

    <template v-for="(child) in widget.children">
      <CanvasWidget :widget="child" :key="child.name" @setActive="setActive"/>
    </template>

  </div>
</template>

<script>
import WidgetHelper from "@/components/widget/WidgetHelper";

export default {
  name: 'WidgetPage',
  components: {CanvasWidget: () => import( "@/components/widget/CanvasWidget")},
  mixins: [WidgetHelper],
  data() {
    return {
      page: {children: []}
    }
  },
  methods: {
    onDrop(evt) {
      const widget = evt.dataTransfer.getData('widget')
      this.page.children.push(JSON.parse(widget))
    }
  },
  beforeMount() {
    this.page = this.widget
  }
}
</script>

<style scoped>

</style>