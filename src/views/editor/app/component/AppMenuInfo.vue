<template>
  <v-card class="pa-2 ma-3" color="secondary">
    <v-container fluid class="pa-3">
      <v-row>
        <v-col class="text-start" cols="auto">
          <div class="text-h6 pb-2">
            {{ project.name }}
          </div>

          <div class="text-body-2 text--secondary">
            {{ project.description }}
          </div>
        </v-col>

        <v-spacer></v-spacer>

        <v-col cols="auto" class="text-start">
          <v-text-field
              color="accent"
              prepend-icon="fa-palette"
              flat readonly
              :label="i18n('project.theme')"
              :value="themeName"
          />
        </v-col>

        <v-col cols="auto" class="text-start">
          <v-text-field
              color="accent"
              prepend-icon="fa-database"
              flat readonly
              :label="i18n('project.datasource')"
              :value="datasourceName"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'AppMenuInfo',
  props: {
    project: Object,
    themeName: String,
    datasourceName: String
  }
})
</script>

<style scoped>

</style>