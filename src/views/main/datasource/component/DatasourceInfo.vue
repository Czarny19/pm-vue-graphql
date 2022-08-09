<template>
  <v-card class="pa-1" color="primary">
    <v-card-subtitle class="text-start text-body-2">
      <v-container fluid class="pa-0">
        <v-row>
          <v-col class="pa-4 ma-auto" cols="auto">
            <v-icon size="32">fa-info-circle</v-icon>
          </v-col>
          <v-col class="pa-2 pl-3">
            {{ i18n('datasource.configInfoLine1') }}<br/>
            {{ i18n('datasource.configInfoLine2') }}<br/>
            {{ i18n('datasource.configInfoLine3') }}<br/>
          </v-col>
        </v-row>
      </v-container>
    </v-card-subtitle>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'DatasourceInfo'
})
</script>

<style scoped>

</style>