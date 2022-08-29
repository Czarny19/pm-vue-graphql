<template>
  <div>
    <AppMenuNavigation :tab="currentTab" @tabchange="changeTab"/>
    <AppMenuInfo :project="project" :theme-name="theme.name" :datasource-name="datasource.name"/>

    <v-divider></v-divider>

    <AppMenuTabSettings
        v-if="currentTab === 0"
        :project="project"
        :pages="pages"
        :loading="loadingPages">
    </AppMenuTabSettings>
    <AppMenuTabPages
        v-if="currentTab === 1"
        :loading="loadingPages"
        :pages="pages"
        :project-id="project.id"
        :datasource-id="datasource.id">
    </AppMenuTabPages>
    <AppMenuTabTables v-else-if="currentTab === 2" :datasource="datasource"/>
    <AppMenuTabQueries
        v-else-if="currentTab === 3"
        :datasource="datasource"
        :queries="queries"
        :loading="loadingQueries"/>
    <AppMenuTabMutations
        v-else-if="currentTab === 4"
        :datasource="datasource"
        :mutations="mutations"
        :loading="loadingMutations">
    </AppMenuTabMutations>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import AppMenuNavigation from "@/views/editor/app/component/AppMenuNavigation.vue";
import AppMenuTabPages from "@/views/editor/app/component/pages/AppMenuTabPages.vue";
import AppMenuInfo from "@/views/editor/app/component/AppMenuInfo.vue";
import AppMenuTabTables from "@/views/editor/app/component/tables/AppMenuTabTables.vue";
import AppMenuTabQueries from "@/views/editor/app/component/queries/AppMenuTabQueries.vue";
import AppMenuTabMutations from "@/views/editor/app/component/mutations/AppMenuTabMutations.vue";
import AppMenuTabSettings from "@/views/editor/app/component/settings/AppMenuTabSettings.vue";
import {GET_PAGE_LIST_BY_PROJECT_ID} from "@/graphql/queries/page";
import {CURRENT_USER} from "@/graphql/queries/user";
import {GET_PROJECT_BY_ID} from "@/graphql/queries/project";
import {GET_THEME_BY_ID} from "@/graphql/queries/theme";
import {GET_DATA_SOURCE_BY_ID} from "@/graphql/queries/datasource";
import {decodeDatasourceSecret} from "@/lib/schema";
import {GET_MUTATION_LIST_BY_DATA_SOURCE_ID} from "@/graphql/queries/mutation";
import {GET_QUERY_LIST_BY_DATA_SOURCE_ID} from "@/graphql/queries/query";

export default Vue.extend({
  name: 'AppPage',
  components: {
    AppMenuTabSettings,
    AppMenuTabMutations,
    AppMenuNavigation,
    AppMenuTabPages,
    AppMenuInfo,
    AppMenuTabTables,
    AppMenuTabQueries
  },
  data() {
    return {
      loadingPages: true,
      loadingQueries: true,
      loadingMutations: true,
      currentTab: 0,
      project: {},
      pages: [],
      theme: {},
      datasource: {},
      mutations: [],
      queries: []
    }
  },
  computed: {
    projectId(): number {
      return Number(this.$route.params.projectId)
    }
  },
  methods: {
    changeTab(tab: number): void {
      if (tab != undefined && tab !== this.currentTab) {
        this.currentTab = tab
        this.$router.push({name: 'App', params: {projectId: this.projectId.toString(), tab: tab.toString()}})
      }
    }
  },
  apollo: {
    currentUser: {
      query: CURRENT_USER
    },
    PROJECT: {
      query: GET_PROJECT_BY_ID,
      fetchPolicy: 'no-cache',
      variables(): { id: number } {
        return {
          id: this.projectId
        }
      },
      skip(): boolean {
        return !this.currentUser
      },
      result({data}): void {
        this.project = data.PROJECT[0]
      },
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
      }
    },
    QUERY: {
      query: GET_QUERY_LIST_BY_DATA_SOURCE_ID,
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
        this.queries = data.QUERY
        this.loadingQueries = false
      }
    },
    MUTATION: {
      query: GET_MUTATION_LIST_BY_DATA_SOURCE_ID,
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
  },
  async beforeMount() {
    this.currentTab = Number(this.$route.params.tab)
  }
})
</script>

<style scoped>

</style>