<template>
  <v-card-text>
    <v-icon class="pa-6" size="60">fa-folder-open</v-icon>
    <div class="pa-6 text-h5">{{ msg }}</div>
  </v-card-text>
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