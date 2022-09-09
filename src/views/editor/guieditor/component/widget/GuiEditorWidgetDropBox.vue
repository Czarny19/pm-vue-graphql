<template>
  <v-card
      v-if="drag"
      class="editor--drag-container"
      @drop.self="onDrop"
      @dragover.prevent
      @dragenter.prevent
      @click.prevent
  />
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'GuiEditorWidgetDropBox',
  props: {
    drag: Boolean,
    parentWidget: Object
  },
  methods: {
    onDrop(evt?: DragEvent) {
      this.$emit('eldrop', evt)
    }
  }
})
</script>

<style scoped>

</style>