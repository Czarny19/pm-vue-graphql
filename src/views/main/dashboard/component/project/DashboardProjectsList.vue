<template>
  <v-expansion-panels>
    <v-expansion-panel v-for="project in projects" :key="project.id">
      <v-expansion-panel-header class="text-start" expand-icon="fa-angle-down" color="secondary">
        {{ project.name }}
      </v-expansion-panel-header>

      <v-expansion-panel-content class="pl-4 pr-4 pb-4">
        <div class="text-body-1 text-start pt-4">{{ project.description }}</div>

        <v-container fluid class="text-start pt-4 pb-4 pl-0 pr-0">
          <v-row no-gutters>
            <v-col>
              <SimpleValueField :label="i18n('dashboard.createDate')" :value="project.create_date"/>
            </v-col>

            <v-col>
              <SimpleValueField :label="i18n('dashboard.theme')" :value="project.project_theme.name"/>
            </v-col>

            <v-col v-if="project.project_data_source">
              <SimpleValueField :label="i18n('dashboard.datasource')" :value="project.project_data_source.name"/>
            </v-col>

            <v-col v-else>
              <SimpleValueField :label="i18n('dashboard.datasource')" :value="i18n('common.none')"/>
            </v-col>
          </v-row>
        </v-container>

        <v-divider></v-divider>

        <v-container fluid class="pa-0 pt-4">
          <v-row no-gutters>
            <v-col cols="6" class="text-start">
              <IconButton
                  :label="i18n('common.modify')"
                  color="info"
                  icon="fa-edit"
                  @click="openModifyProject(project.id)">
              </IconButton>
              <IconButton
                  class="ml-6"
                  :label="i18n('dashboard.editor')"
                  color="secondary"
                  icon="fa-pencil"
                  @click="openApp(project.id)">
              </IconButton>
            </v-col>

            <v-col class="text-end">
              <IconButton
                  :label="i18n('common.delete')"
                  color="error"
                  icon="fa-trash-can"
                  @click="deleteProjectClicked(project.id)">
              </IconButton>
            </v-col>
          </v-row>
        </v-container>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import Vue from "vue";
import IconButton from "@/components/button/IconButton.vue";
import SimpleValueField from "@/components/form/SimpleValueField.vue";

export default Vue.extend({
  name: 'DashboardProjectsList',
  components: {SimpleValueField, IconButton},
  props: {
    projects: Array
  },
  methods: {
    openModifyProject(id: string): void {
      this.$router.push({name: 'Project', params: {projectId: id}})
    },
    openApp(id: string): void {
      this.$router.push({name: 'App', params: {projectId: id, tab: '0'}})
    },
    deleteProjectClicked(id: number): void {
      this.$emit('delete', id)
    }
  }
})
</script>

<style scoped>

</style>