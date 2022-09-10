<template>
  <div class="text-center">
    <v-dialog v-model="isOpen" width="400">
      <v-card :color="theme.background_color">
        <v-card-text class="pt-6">
          <v-progress-circular indeterminate :color="theme.primary_color" size="50"/>
          <div class="text-h6 pt-8" :style="{'color': theme.text_color_1}">{{ i18n('runtime.saving') }}...</div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'AppRunnerSavingDialog',
  props: {
    dialog: Boolean,
    theme: Object
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