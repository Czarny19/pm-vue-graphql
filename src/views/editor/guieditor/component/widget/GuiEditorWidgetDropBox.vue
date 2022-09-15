<template>
  <div
      v-if="drag"
      class="editor--drag-container-on"
      @drop.self="onDrop"
      @dragover.prevent
      @dragenter.prevent
      @click.prevent
  />

  <div
      v-else
      class="editor--drag-container-off"
      :style="{'width': `${projectViewEnabled ? '100%': '0%'}`}"
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
    projectViewEnabled: Boolean
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