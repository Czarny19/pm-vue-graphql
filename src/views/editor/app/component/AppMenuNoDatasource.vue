<template>
  <v-card class="mt-4 mb-4 pa-6" color="primary">
    <v-icon class="pa-6" size="60" color="error">fa-database</v-icon>
    <div class="pa-6 text-h5">{{ i18n('editor.noDatasource') }}</div>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'AppMenuNoDatasource'
})
</script>

<style scoped>

</style>