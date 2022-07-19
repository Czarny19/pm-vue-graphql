<template>
  <v-snackbar v-model="snackbarOpen">
    {{ text }}
  </v-snackbar>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'AppSnackbar',
  props: {
    snackbar: Boolean,
    text: String
  },
  data() {
    return {
      snackbarOpen: false
    }
  },
  watch: {
    snackbar() {
      this.snackbarOpen = this.snackbar
    }
  }
})
</script>

<style scoped>

</style>