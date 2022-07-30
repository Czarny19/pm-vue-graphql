<template>
  <v-dialog persistent v-model="isOpen" width="400">
    <template v-slot:activator="{ on, attrs }">
      <div v-bind="attrs" v-on="on">
        <slot name="activator"/>
      </div>
    </template>
    <v-card>
      <v-card-title class="text-start">{{ title }}</v-card-title>
      <v-card-text class="text-start text-body-2">{{ msg }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="close">{{ i18n('common.ok') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'InfoDialog',
  props: {
    dialog: Boolean,
    title: String,
    msg: String
  },
  data() {
    return {
      isOpen: false
    }
  },
  watch: {
    dialog(): void {
      this.isOpen = this.dialog
    }
  },
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    },
    close() {
      this.$emit('close')
    }
  }
})
</script>

<style scoped>

</style>