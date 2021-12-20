<template>
  <div class="canvas__editor--element" @click.self="setActive(widget)">Text...</div>
</template>

<script>
import WidgetHelper from "@/views/canvas/widgets/WidgetHelper";

export default {
  name: 'WidgetText',
  mixins: [WidgetHelper]
}
</script>

<style scoped>

</style>