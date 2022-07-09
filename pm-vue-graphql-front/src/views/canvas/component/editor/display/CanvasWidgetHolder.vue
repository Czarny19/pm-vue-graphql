<template>
  <div>
    <div class="text-start text-body-2 secondary pa-2">{{ name }}</div>

    <div class="canvas__editor--element">
      <slot name="widget"/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'CanvasWidgetHolder',
  props: {
    name: String
  }
})
</script>

<style scoped>

</style>