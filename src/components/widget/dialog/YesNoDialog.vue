<template>
  <div class="text-center">
    <v-dialog v-model="isOpen" width="400">
      <v-card :color="theme.background_color">
        <v-card-title :style="{'color': theme.primary_color}">{{ title }}</v-card-title>
        <v-card-subtitle class="text-start text-body-1 pt-4" :style="{'color': theme.text_color_1}">
          {{ msg }}
        </v-card-subtitle>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="mr-4" text :color="theme.error_color" @click="cancel">{{ i18n('common.cancel') }}</v-btn>
          <v-btn text :color="theme.success_color" @click="confirm">{{ i18n('common.confirm') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'YesNoDialog',
  props: {
    dialog: Boolean,
    title: String,
    msg: String,
    theme: Object
  },
  data() {
    return {
      isOpen: false
    }
  },
  methods: {
    confirm(): void {
      this.$emit('choiceclick', true);
      this.isOpen = false;
    },
    cancel(): void {
      this.$emit('choiceclick', false);
      this.isOpen = false;
    }
  },
  watch: {
    dialog(): void {
      console.log('open')
      this.isOpen = this.dialog;
    }
  }
})
</script>

<style scoped>

</style>