<template>
  <v-container fluid>
    <TitleCard class="ma-1 mb-2" :title="i18n('project.project')" icon="fa-tablet"/>
    <ProjectForm
        :loading="loading"
        :project="project"
        :datasources="datasources"
        :themes="themes"
        :user-id="currentUser.id"
    />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import ProjectForm from "@/views/main/project/component/ProjectForm.vue";
import TitleCard from "@/components/card/TitleCard.vue";
import {CURRENT_USER} from "@/graphql/queries/user";
import {GET_PROJECT_BY_ID} from "@/graphql/queries/project";
import {GET_THEME_LIST_BY_USER_ID} from "@/graphql/queries/theme";
import {GET_DATA_SOURCE_LIST_BY_USER_ID} from "@/graphql/queries/datasource";
import {Datasource} from "@/lib/types";
import {decodeDatasourceSecret} from "@/lib/schema";

export default Vue.extend({
  name: 'ProjectPage',
  components: {TitleCard, ProjectForm},
  data() {
    return {
      loadingProject: true,
      loadingThemes: true,
      loadingDatasources: true,
      currentUser: {id: -1},
      project: {},
      themes: [],
      datasources: []
    }
  },
  computed: {
    projectId(): number {
      return Number(this.$route.params.projectId);
    },
    loading(): boolean {
      return this.loadingProject || this.loadingThemes || this.loadingDatasources;
    }
  },
  apollo: {
    currentUser: {
      query: CURRENT_USER
    },
    PROJECT: {
      query: GET_PROJECT_BY_ID,
      fetchPolicy: 'network-only',
      variables(): { id: number } {
        return {
          id: this.projectId
        }
      },
      skip(): boolean {
        return !this.projectId;
      },
      result({data}): void {
        this.project = data.PROJECT[0];
        this.loadingProject = false;
      }
    },
    THEME: {
      query: GET_THEME_LIST_BY_USER_ID,
      fetchPolicy: 'network-only',
      variables(): { userId: number } {
        return {
          userId: this.currentUser.id
        }
      },
      skip(): boolean {
        return !this.currentUser;
      },
      result({data}): void {
        this.themes = data.THEME;
        this.loadingThemes = false;
      }
    },
    DATA_SOURCE: {
      query: GET_DATA_SOURCE_LIST_BY_USER_ID,
      fetchPolicy: 'no-cache',
      variables(): { userId: number } {
        return {
          userId: this.currentUser.id
        }
      },
      skip(): boolean {
        return !this.currentUser;
      },
      result({data}): void {
        this.datasources = data.DATA_SOURCE;
        this.datasources.forEach((ds: Datasource) => ds.secret = decodeDatasourceSecret(ds.secret ?? ''));
        this.loadingDatasources = false;
      }
    }
  },
  beforeMount() {
    if (!this.projectId) {
      this.loadingProject = false;
    }
  }
})
</script>

<style scoped>

</style>