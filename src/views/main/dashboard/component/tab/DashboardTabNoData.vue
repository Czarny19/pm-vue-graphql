<template>
  <v-card color="secondary" class="pa-3 text-start">
    <v-icon class="pa-3">fa-folder-open</v-icon>
    <span class="pa-2 text-body-1">{{ msg }}</span>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'DashboardTabNoData',
  props: {
    msg: String
  }
})
</script>

<style scoped>

</style>