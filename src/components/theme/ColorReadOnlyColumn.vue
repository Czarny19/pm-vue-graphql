<template>
  <v-col class="pl-2 pr-2 pb-6" cols="12" sm="12" md="12" :lg="cols" :xl="cols">
    <v-btn class="pa-2 pb-5 pt-5 disable-events" :color="color" width="100%">
      <v-card color="primary" class="pa-1 mr-auto">{{ label }}: {{ color }}</v-card>
    </v-btn>
  </v-col>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'ColorReadOnlyColumn',
  props: {
    color: String,
    label: String,
    cols: Number
  }
})
</script>

<style scoped>

</style>