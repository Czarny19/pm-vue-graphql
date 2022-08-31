<template>
  <v-card color="error" elevation="10" class="ma-6">
    <v-card-title class="text-center pa-8">
      <v-container>
        <v-row>
          <v-icon class="ml-auto mr-auto" color="accent" size="60">fa-power-off</v-icon>
        </v-row>
        <v-row>
          <div class="ml-auto mr-auto mt-8">
            {{ i18n('runtime.appOffline') }}
          </div>
        </v-row>
      </v-container>
    </v-card-title>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'AppRunnerPageOffline'
})
</script>

<style scoped>

</style>