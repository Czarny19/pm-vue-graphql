<template>
  <v-text-field @click.self="setActive(widget)" :label="widget.id"></v-text-field>
</template>

<script>
import WidgetHelper from "@/views/canvas/widgets/WidgetHelper";

export default {
  name: 'WidgetTextField',
  mixins: [WidgetHelper]
}
</script>

<style scoped>

</style>