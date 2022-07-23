<template>
  <v-card class="pa-8" color="primary">
    <v-card-title>
      <v-icon class="ma-auto" size="80">fa-database</v-icon>
    </v-card-title>

    <v-card-text class="text-h4 mt-8">
      {{ i18n('datasource.configInfo') }}
    </v-card-text>

    <v-card-subtitle class="text-start text-body-1 mt-4">
      <v-container fluid>
        <v-row>
          <v-col>{{ i18n('datasource.configInfoLine1') }}</v-col>
        </v-row>
        <v-row>
          <v-col>{{ i18n('datasource.configInfoLine2') }}</v-col>
        </v-row>
        <v-row>
          <v-col>{{ i18n('datasource.configInfoLine3') }}</v-col>
        </v-row>
      </v-container>
    </v-card-subtitle>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'DataSourceInfo',
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    }
  }
})
</script>

<style scoped>

</style>