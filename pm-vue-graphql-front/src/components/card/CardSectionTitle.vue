<template>
  <v-card-title class="secondary ml-3 mr-3 pt-2 pb-2 elevation-2 rounded">{{ title }}</v-card-title>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'CardSectionTitle',
  props: {
    title: String
  }
})
</script>

<style scoped>

</style>