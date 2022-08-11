<template>
  <div class="text-body-2">
    <span class="text--secondary">{{ label }}: </span>
    <b>{{ value }}</b>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'SimpleValueField',
  props: {
    label: String,
    value: String
  }
})
</script>

<style scoped>

</style>