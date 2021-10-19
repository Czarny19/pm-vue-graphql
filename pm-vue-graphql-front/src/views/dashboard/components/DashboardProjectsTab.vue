<template>
  <v-card color="secondary" class="dashboard__tabs--container">
    <v-card-title class="primary">
      <v-icon class="pr-4">fa-tablet</v-icon>
      {{ $t('dashboard.projects') }}
    </v-card-title>

    <v-card-text v-if="projects.length === 0">
      <v-icon class="pt-6" x-large>fa-tablet</v-icon>
      <div class="pt-2">{{ $t('dashboard.noProjects') }}</div>
      <v-btn class="mt-6 dashboard__tabs--first-button" color="success" @click="openProject">
        {{ $t('dashboard.addFirstProject') }}
      </v-btn>
    </v-card-text>

    <v-card-text v-else class="pa-2">
      <v-expansion-panels>
        <v-expansion-panel v-for="project in projects" :key="project.id">
          <v-expansion-panel-header class="primary text-left" expand-icon="fa-angle-down">
            <div class="text-on-accent">{{ project.name }}</div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-card-text class="text-left text-h6 pl-0 pr-0">
              {{ project.description }}
            </v-card-text>
            <v-card-subtitle class="text-left text-body-2 pa-0 pb-1">
              {{ $t('dashboard.createDate') }}: {{ project.create_date }}
            </v-card-subtitle>
            <v-divider/>
            <v-card-actions class="pl-0 pr-0 pt-4">
              <v-btn class="pl-4 pr-4 ml-auto mr-2" color="primary" @click="openProjectCanvas(project.id)">
                {{ $t('common.open') }}
              </v-btn>
              <v-btn class="pl-4 pr-4 mr-2" color="info" @click="openModifyProject(project.id)">
                {{ $t('common.modify') }}
              </v-btn>
              <v-btn class="pl-4 pr-4" color="error" @click="deleteProject(project.id)">
                {{ $t('common.delete') }}
              </v-btn>
            </v-card-actions>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>

      <div class="text-right">
        <v-btn class="mt-4 mb-2" color="success" @click="openProject">{{ $t('dashboard.addApp') }}</v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import {DELETE_PROJECT, GET_USER_PROJECTS_QUERY} from "@/graphql/queries/project";
import {CURRENT_USER} from "@/graphql/queries/user";

export default {
  name: 'DashboardProjectsTab',
  data() {
    return {
      currentUser: null,
      projects: []
    }
  },
  methods: {
    openProject() {
      this.$router.push({name: 'Project'})
    },
    openProjectCanvas(id) {
      this.$router.push({name: 'Canvas', params: {projectId: id}})
    },
    openModifyProject() {

    },
    deleteProject(id) {
      this.$apollo.mutate({
        mutation: DELETE_PROJECT,
        variables: {
          id: id
        }
      }).then(() => {
        this.$apollo.queries.PROJECT.refetch()
      })
    }
  },
  apollo: {
    currentUser: {
      query: CURRENT_USER
    },
    PROJECT: {
      query: GET_USER_PROJECTS_QUERY,
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
        this.projects = data.PROJECT
      },
    }
  }
}
</script>

<style scoped>

</style>