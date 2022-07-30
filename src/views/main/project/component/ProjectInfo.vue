<template>
  <v-card class="pa-8" color="primary">
    <v-card-title>
      <v-icon class="ma-auto" size="80">fa-tablet</v-icon>
    </v-card-title>

    <v-card-text class="text-h4 mt-8">
      {{ i18n('project.configInfo') }}
    </v-card-text>

    <v-card-subtitle class="text-start text-body-1 mt-4">
      <v-container fluid>
        <v-row>
          <v-col cols="auto" class="ma-auto">
            <v-icon>fa-info-circle</v-icon>
          </v-col>
          <v-col>{{ i18n('project.projectInfo') }}</v-col>
        </v-row>
        <v-row>
          <v-col cols="auto" class="ma-auto">
            <v-icon>fa-palette</v-icon>
          </v-col>
          <v-col>{{ i18n('project.themeInfo') }}</v-col>
        </v-row>
        <v-row>
          <v-col cols="auto" class="ma-auto">
            <v-icon>fa-database</v-icon>
          </v-col>
          <v-col>{{ i18n('project.dbInfo') }}</v-col>
        </v-row>
      </v-container>
    </v-card-subtitle>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'ProjectInfo',
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    }
  }
})
</script>

<style scoped>

</style>