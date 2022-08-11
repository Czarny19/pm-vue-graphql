<template>
  <v-card color="primary" class="mt-3 mb-3" @click="add">
    <v-container fluid class="pl-6 pr-6 pt-3 pb-3 text-start ma-auto">
      <v-icon class="mr-5">fa-circle-plus</v-icon>
      {{ label }}
    </v-container>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'AddItemCard',
  props: {
    label: String
  },
  methods: {
    add(): void {
      this.$emit('add')
    }
  }
})
</script>

<style scoped>

</style>