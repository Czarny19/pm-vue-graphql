<template>
  <v-card color="primary">
    <v-container fluid>
      <v-row>
        <v-col>
          <v-text-field
              class="pa-4"
              color="accent"
              :value="project.name"
              :label="i18n('project.name')"
              prepend-icon="fa-tag"
              readonly>
          </v-text-field>

          <v-textarea
              class="pa-4"
              color="accent"
              :value="project.description"
              :label="i18n('project.description')"
              prepend-icon="fa-pen"
              readonly
              auto-grow
              rows="1">
          </v-textarea>
        </v-col>

        <v-col>
          <v-text-field
              class="pa-4"
              color="accent"
              :value="themeName"
              :label="i18n('project.theme')"
              prepend-icon="fa-palette"
              readonly>
          </v-text-field>

          <v-text-field
              class="pa-4"
              color="accent"
              :value="datasourceName"
              :label="i18n('project.datasource')"
              prepend-icon="fa-database"
              readonly>
          </v-text-field>
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
  },
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    }
  }
})
</script>

<style scoped>

</style>