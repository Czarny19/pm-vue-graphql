<template>
  <div class="canvas__editor--display">
    <Widget :widget="currentPage" @setActive="setActive"/>
  </div>
</template>

<script>
import Widget from "@/views/canvas/widgets/Widget";

export default {
  name: 'CanvasDisplay',
  components: {Widget},
  props: {
    projectName: String,
    currentPage: Object
  },
  methods: {
    setActive(widget) {
      console.log(widget.id)
      this.$emit('setActive', widget)
    }
  }
}
</script>

<style scoped>

</style>