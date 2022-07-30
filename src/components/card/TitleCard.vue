<template>
  <v-card color="primary">
    <v-card-title class="text-h5">
      <v-icon class="pl-2 pr-8" large>{{ icon }}</v-icon>
      {{ title }}
    </v-card-title>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'TitleCard',
  props: {
    title: String,
    icon: String
  }
})
</script>

<style scoped>

</style>