<template>
  <v-btn small class="pa-4" min-width="100" :color="color" @click="click" :block="block">
    {{ label }}
    <v-icon small class="pl-6">{{ icon }}</v-icon>
  </v-btn>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'IconButton',
  props: {
    label: String,
    color: String,
    icon: String,
    block: Boolean
  },
  methods: {
    click() {
      this.$emit('click')
    }
  }
})
</script>

<style scoped>

</style>