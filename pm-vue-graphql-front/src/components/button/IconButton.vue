<template>
  <v-btn class="pa-6" min-width="160" :color="color" @click="click">
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
    icon: String
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