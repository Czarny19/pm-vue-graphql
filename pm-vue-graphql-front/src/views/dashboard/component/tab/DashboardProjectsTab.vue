<template>
  <div>
    <DeleteConfirmationDialog :dialog="deleteDialog" @confirm="deleteProject" @cancel="cancelDeleteProject"/>

    <InfoDialog
        :dialog="warningDialog"
        :title="i18n('dashboard.projectThemeWarning')"
        :msg="i18n('dashboard.projectThemeRequired')"
        @close="closeWarningDialog">
    </InfoDialog>

    <v-card class="mb-4" color="primary">
      <TitleCard :title="i18n('dashboard.projects')" icon="fa-tablet"/>
    </v-card>

    <v-card color="primary">
      <LoadingCircular v-if="loading"/>
      <DashboardTabNoData v-else-if="!projects.length && !loading" :msg="i18n('dashboard.noProjects')"/>
    </v-card>

    <v-expansion-panels v-if="projects.length && !loading">
      <v-expansion-panel v-for="project in projects" :key="project.id">
        <v-expansion-panel-header class="text-start text-body-1" expand-icon="fa-angle-down" color="secondary">
          {{ project.name }}
        </v-expansion-panel-header>

        <v-expansion-panel-content>
          <div class="text-h6 text-start pt-4">
            {{ project.description }}
          </div>

          <div class="text-start">
            <v-container fluid class="pt-4 pb-4 pl-0 pr-0">
              <v-row no-gutters>
                <v-col>
                  <div class="text-body-2">{{ i18n('dashboard.createDate') }}:</div>
                  <div class="text-body-1 font-weight-bold">{{ project.create_date }}</div>
                </v-col>

                <v-col>
                  <div class="text-body-2">{{ i18n('dashboard.theme') }}:</div>
                  <div class="text-body-1 font-weight-bold">{{ project.project_theme.name }}</div>
                </v-col>

                <v-col>
                  <div class="text-body-2">{{ i18n('dashboard.dataSource') }}:</div>
                  <div v-if="project.project_data_source" class="text-body-1 font-weight-bold">
                    {{ project.project_data_source.name }}
                  </div>
                  <div v-else class="text-body-1 font-weight-bold">{{ i18n('common.none') }}</div>
                </v-col>
              </v-row>
            </v-container>
          </div>

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
                    @click="openCanvas(project.id)">
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

    <v-card class="pa-4 mt-4 text-end" color="primary">
      <v-btn class="pa-5" min-width="300" color="success" @click="createProject">
        {{ i18n('dashboard.addProject') }}
        <v-icon small class="pl-6">fa-plus</v-icon>
      </v-btn>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import DeleteConfirmationDialog from "@/components/dialog/DeleteConfirmationDialog.vue";
import TitleCard from "@/components/card/TitleCard.vue";
import LoadingCircular from "@/components/loading/LoadingCircular.vue";
import DashboardTabNoData from "@/views/dashboard/component/tab/DashboardTabNoData.vue";
import IconButton from "@/components/button/IconButton.vue";
import {DELETE_PROJECT, GET_USER_PROJECTS} from "@/graphql/queries/project";
import {CURRENT_USER} from "@/graphql/queries/user";
import {GET_USER_THEMES} from "@/graphql/queries/theme";
import InfoDialog from "@/components/dialog/InfoDialog.vue";

export default Vue.extend({
  name: 'DashboardProjectsTab',
  components: {
    InfoDialog,
    IconButton,
    DashboardTabNoData,
    LoadingCircular,
    TitleCard,
    DeleteConfirmationDialog
  },
  data() {
    return {
      loading: true,
      warningDialog: false,
      deleteDialog: false,
      deleteId: -1,
      currentUser: {id: -1},
      projects: [],
      themes: []
    }
  },
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    },
    createProject(): void {
      if (this.themes.length === 0) {
        this.warningDialog = true
        return
      }

      this.$router.push({name: 'NewProject'})
    },
    openModifyProject(id: string): void {
      this.$router.push({name: 'Project', params: {projectId: id}})
    },
    openCanvas(id: string): void {
      this.$router.push({name: 'Canvas', params: {projectId: id}})
    },
    deleteProjectClicked(id: number): void {
      this.deleteId = id
      this.deleteDialog = true
    },
    cancelDeleteProject(): void {
      this.deleteId = -1
      this.deleteDialog = false
    },
    deleteProject(): void {
      this.deleteDialog = false

      this.$apollo.mutate({
        mutation: DELETE_PROJECT,
        variables: {
          id: this.deleteId
        }
      }).then(() => {
        this.$apollo.queries.PROJECT.refetch()
      })
    },
    closeWarningDialog(): void {
      this.warningDialog = false
    }
  },
  apollo: {
    currentUser: {
      query: CURRENT_USER
    },
    PROJECT: {
      query: GET_USER_PROJECTS,
      fetchPolicy: 'network-only',
      variables(): { userId: number } {
        return {
          userId: this.currentUser.id
        }
      },
      skip(): boolean {
        return !this.currentUser
      },
      result({data}): void {
        this.loading = false
        this.projects = data.PROJECT
      },
    },
    THEME: {
      query: GET_USER_THEMES,
      fetchPolicy: 'network-only',
      variables(): { userId: number } {
        return {
          userId: this.currentUser.id
        }
      },
      skip(): boolean {
        return !this.currentUser
      },
      result({data}): void {
        this.themes = data.THEME
      }
    }
  }
})
</script>

<style scoped>

</style>