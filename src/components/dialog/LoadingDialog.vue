<template>
  <div class="text-center">
    <v-dialog v-model="isOpen" width="400">
      <v-card>
        <v-card-text class="pt-6">
          <v-progress-circular indeterminate color="accent" size="50"/>
          <div class="text-h6 pt-8">{{ title }}...</div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'LoadingDialog',
  props: {
    title: String,
    dialog: Boolean
  },
  data() {
    return {
      isOpen: false
    }
  },
  watch: {
    dialog(): void {
      this.isOpen = this.dialog;
    }
  }
})
</script>

<style scoped>

</style>