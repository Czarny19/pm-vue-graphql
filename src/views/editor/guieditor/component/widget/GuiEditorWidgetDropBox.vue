<template>
  <v-card
      v-if="drag"
      class="editor--drag-container"
      width="90%"
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
    onDrop(evt?: DragEvent): void {
      this.$emit('eldrop', evt);
    }
  }
})
</script>

<style scoped>

</style>