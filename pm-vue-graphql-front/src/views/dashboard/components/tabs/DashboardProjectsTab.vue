<template>
  <v-card color="secondary" class="dashboard__tabs--container">
    <DeleteConfirmationDialog :dialog="deleteDialog" @confirmed="deleteProject" @cancelled="cancelDeleteProject"/>

    <DashboardProjectWarningDialog :dialog="warningDialog" @closed="closeWarningDialog"/>

    <v-card-title class="primary">
      <v-icon class="pr-4">fa-tablet</v-icon>
      {{ $t('dashboard.projects') }}
    </v-card-title>

    <v-card-text v-if="loading">
      <v-progress-circular class="ml-auto mr-auto card-loading" indeterminate color="primary" size="50"/>
    </v-card-text>

    <v-card-text v-else-if="projects.length === 0 && !loading">
      <v-icon class="pt-6" x-large>fa-tablet</v-icon>
      <div class="pt-6 title-text">{{ $t('dashboard.noProjects') }}</div>
      <v-btn class="mt-6 dashboard__tabs--first-button" color="success" @click="createProject">
        {{ $t('dashboard.addFirstProject') }}
      </v-btn>
    </v-card-text>

    <v-card-text v-else class="pa-2">
      <v-expansion-panels>
        <v-expansion-panel v-for="project in projects" :key="project.id">
          <v-expansion-panel-header class="primary text-left" expand-icon="fa-angle-down">
            {{ project.name }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-card-text class="text-left text-h6 pl-0 pr-0 text-on-primary">
              {{ project.description }}
            </v-card-text>
            <v-card-subtitle class="text-left text-body-2 pa-0 pb-5">
              <div class="text-on-primary">{{ $t('dashboard.createDate') }}:</div>
              <div class="medium-text">{{ project.create_date }}</div>
            </v-card-subtitle>
            <v-card-subtitle class="text-left text-body-2 pa-0 pb-5">
              <div class="text-on-primary">{{ $t('dashboard.theme') }}:</div>
              <div class="medium-text">{{ project.project_theme.name }}</div>
            </v-card-subtitle>
            <v-card-subtitle class="text-left text-body-2 pa-0 pb-3">
              <div class="text-on-primary"> {{ $t('dashboard.dataSource') }}:</div>
              <div v-if="project.project_data_source" class="medium-text">
                {{ project.project_data_source.name }}
              </div>
              <div v-else class="medium-text">{{ $t('common.none') }}</div>
            </v-card-subtitle>
            <v-divider/>
            <v-card-actions class="pl-0 pr-0 pt-4">
              <v-btn class="pl-4 pr-4 ml-auto mr-2" color="accent" @click="openProjectCanvas(project.id)">
                {{ $t('dashboard.editor') }}
              </v-btn>
              <v-btn class="pl-4 pr-4 mr-2" color="info" @click="openModifyProject(project.id)">
                {{ $t('common.modify') }}
              </v-btn>
              <v-btn class="pl-4 pr-4" color="error" @click="deleteProjectClicked(project.id)">
                {{ $t('common.delete') }}
              </v-btn>
            </v-card-actions>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>

      <div class="text-right">
        <v-btn class="mt-4 mb-2" color="success" @click="createProject">{{ $t('dashboard.addProject') }}</v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import {DELETE_PROJECT, GET_USER_PROJECTS} from "@/graphql/queries/project";
import {CURRENT_USER} from "@/graphql/queries/user";
import DashboardProjectWarningDialog from "@/views/dashboard/components/warnings/DashboardProjectWarningDialog";
import {GET_USER_THEMES_QUERY} from "@/graphql/queries/theme";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";

export default {
  name: 'DashboardProjectsTab',
  components: {DeleteConfirmationDialog, DashboardProjectWarningDialog},
  data() {
    return {
      loading: true,
      warningDialog: false,
      deleteDialog: false,
      deleteId: null,
      currentUser: null,
      projects: [],
      themes: []
    }
  },
  methods: {
    createProject() {
      if (this.themes.length === 0) {
        this.warningDialog = true
        return
      }

      this.$router.push({name: 'NewProject'})
    },
    openProjectCanvas(id) {
      this.$router.push({name: 'Canvas', params: {projectId: id}})
    },
    openModifyProject(id) {
      this.$router.push({name: 'Project', params: {projectId: id}})
    },
    deleteProjectClicked(id) {
      this.deleteId = id
      this.deleteDialog = true
    },
    cancelDeleteProject() {
      this.deleteId = null
      this.deleteDialog = false
    },
    deleteProject() {
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
    closeWarningDialog() {
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
      variables() {
        return {
          user_id: this.currentUser.id
        }
      },
      skip() {
        return !this.currentUser
      },
      result({data}) {
        this.loading = false
        this.projects = data.PROJECT
      },
    },
    THEME: {
      query: GET_USER_THEMES_QUERY,
      fetchPolicy: 'network-only',
      variables() {
        return {
          user_id: this.currentUser.id
        }
      },
      skip() {
        return !this.currentUser
      },
      result({data}) {
        this.themes = data.THEME
      }
    }
  }
}
</script>

<style scoped>

</style>