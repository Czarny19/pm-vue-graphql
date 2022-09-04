<template>
  <AppRunnerPageOffline v-if="!project.running && !isLoading"/>

  <div v-else-if="!isLoading">
    <AppRunnerTopNav v-if="project.top_nav" :project="project" :theme="theme"/>
    <AppRunnerPageHolder
        v-if="!loadingVariables"
        :page="currentPage"
        :theme="theme"
        :datasource="datasource"
        :variables="variables"
        :mutations="mutations">
    </AppRunnerPageHolder>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import AppRunnerTopNav from "@/views/runtime/apprunner/component/AppRunnerTopNav.vue";
import AppRunnerPageHolder from "@/views/runtime/apprunner/component/AppRunnerPageHolder.vue";
import AppRunnerPageOffline from "@/views/runtime/apprunner/component/AppRunnerPageOffline.vue";
import {GET_PROJECT_BY_ID} from "@/graphql/queries/project";
import {GET_PAGE_LIST_BY_PROJECT_ID} from "@/graphql/queries/page";
import {GET_THEME_BY_ID} from "@/graphql/queries/theme";
import {GET_DATA_SOURCE_BY_ID} from "@/graphql/queries/datasource";
import {GET_PROP_LIST_BY_PAGE_ID} from "@/graphql/queries/prop";
import {GET_EXT_MUTATION_LIST_BY_DATA_SOURCE_ID} from "@/graphql/queries/mutation";
import {decodeDatasourceSecret} from "@/lib/schema";
import {AppProject, Page} from "@/lib/types";

export default Vue.extend({
  name: 'AppRunnerPage',
  components: {AppRunnerPageOffline, AppRunnerPageHolder, AppRunnerTopNav},
  data() {
    return {
      loadingProject: true,
      loadingPages: true,
      loadingTheme: true,
      loadingDatasource: true,
      loadingVariables: true,
      loadingMutations: true,
      project: {},
      theme: {},
      datasource: {},
      pages: [],
      variables: [],
      mutations: []
    }
  },
  computed: {
    projectId(): number {
      return Number(this.$route.params.projectId)
    },
    pageId(): number {
      let pageId = this.$route.params.pageId;
      if (pageId === 'start') pageId = ((this.project as AppProject).start_page ?? '').toString();
      return Number(pageId);
    },
    currentPage(): Page {
      return (this.pages as Page[]).filter((page) => page.id === this.pageId)[0]
    },
    isLoading(): boolean {
      return this.loadingProject || this.loadingPages || this.loadingTheme
          || this.loadingDatasource || this.loadingMutations
    }
  },
  watch: {
    $route() {
      this.loadingVariables = true
    }
  },
  apollo: {
    PROJECT: {
      query: GET_PROJECT_BY_ID,
      fetchPolicy: 'no-cache',
      variables(): { id: number } {
        return {
          id: this.projectId
        }
      },
      result({data}): void {
        this.project = data.PROJECT[0]
        this.loadingProject = false
      }
    },
    PAGE: {
      query: GET_PAGE_LIST_BY_PROJECT_ID,
      fetchPolicy: 'no-cache',
      variables(): { projectId: number } {
        return {
          projectId: this.projectId
        }
      },
      skip(): boolean {
        return !this.projectId
      },
      result({data}): void {
        this.pages = data.PAGE
        this.loadingPages = false
      }
    },
    PROP: {
      query: GET_PROP_LIST_BY_PAGE_ID,
      fetchPolicy: 'no-cache',
      variables(): { pageId: number } {
        return {
          pageId: this.pageId
        }
      },
      skip(): boolean {
        return !this.pageId
      },
      result({data}): void {
        this.variables = data.PROP
        this.loadingVariables = false
      }
    },
    THEME: {
      query: GET_THEME_BY_ID,
      fetchPolicy: 'no-cache',
      variables(): { id: number } {
        return {
          id: this.project.theme_id
        }
      },
      skip(): boolean {
        return !this.project.theme_id
      },
      result({data}): void {
        this.theme = data.THEME[0]

        // eslint-disable-next-line
        document!.getElementById('app')!.style.backgroundColor = this.theme.background_color

        this.loadingTheme = false
      }
    },
    DATA_SOURCE: {
      query: GET_DATA_SOURCE_BY_ID,
      fetchPolicy: 'no-cache',
      variables(): { id: number } {
        return {
          id: this.project.source_id
        }
      },
      skip(): boolean {
        return !this.project.source_id
      },
      result({data}): void {
        this.datasource = data.DATA_SOURCE[0]
        this.datasource.secret = decodeDatasourceSecret(data.DATA_SOURCE[0].secret)
        this.loadingDatasource = false
      }
    },
    MUTATION: {
      query: GET_EXT_MUTATION_LIST_BY_DATA_SOURCE_ID,
      fetchPolicy: 'network-only',
      variables(): { datasourceId: number } {
        return {
          datasourceId: this.project.source_id
        }
      },
      skip(): boolean {
        return !this.project.source_id
      },
      result({data}): void {
        this.mutations = data.MUTATION
        this.loadingMutations = false
      }
    }
  }
})
</script>

<style scoped>

</style>