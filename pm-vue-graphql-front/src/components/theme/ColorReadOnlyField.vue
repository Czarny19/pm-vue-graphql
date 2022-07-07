<template>
  <v-col class="pl-4 pr-4" cols="12" sm="12" md="12" :lg="cols" :xl="cols">
    <v-btn class="pl-2 pr-2 pt-6 pb-6 disable-events" :color="color" width="100%">
      <v-card color="primary" class="pa-1 mr-auto">{{ label }}: {{ color }}</v-card>
    </v-btn>
  </v-col>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'ColorReadOnlyField',
  props: {
    color: String,
    label: String,
    cols: Number
  }
})
</script>

<style scoped>

</style>