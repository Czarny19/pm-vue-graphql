<template>
  <v-dialog v-model="isOpen" width="500">
    <v-card>
      <v-card-title class="text-start">{{ i18n('editor.rejectChangesTitle') }}</v-card-title>

      <v-card-text class="text-start text-body-2">{{ i18n('editor.rejectChangesMsg') }}</v-card-text>

      <v-card-actions>
        <v-btn text @click="cancel">{{ i18n('common.cancel') }}</v-btn>
        <v-spacer></v-spacer>
        <v-btn text color="error" @click="confirm">{{ i18n('editor.rejectChanges') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'RejectChangesDialog',
  props: {
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
  },
  methods: {
    confirm(): void {
      this.$emit('confirm');
    },
    cancel(): void {
      this.$emit('cancel');
    }
  }
})
</script>

<style scoped>

</style>