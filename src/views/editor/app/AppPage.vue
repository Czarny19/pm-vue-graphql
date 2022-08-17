<template>
  <div>
    <AppMenuNavigation :tab="currentTab" @tabchange="changeTab"/>
    <AppMenuInfo :project="project" :theme-name="theme.name" :datasource-name="datasource.name"/>

    <v-divider></v-divider>

    <AppMenuTabPages v-if="currentTab === 0" :project-id="project.id" :datasource-id="datasource.id"/>
    <AppMenuTabTables v-else-if="currentTab === 1" :datasource="datasource"/>
    <AppMenuTabQueries v-else-if="currentTab === 2" :datasource="datasource"/>
    <AppMenuTabMutations v-else-if="currentTab === 3" :datasource="datasource"/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import AppMenuNavigation from "@/views/editor/app/component/AppMenuNavigation.vue";
import AppMenuTabPages from "@/views/editor/app/component/tab/AppMenuTabPages.vue";
import AppMenuInfo from "@/views/editor/app/component/AppMenuInfo.vue";
import AppMenuTabTables from "@/views/editor/app/component/tab/AppMenuTabTables.vue";
import AppMenuTabQueries from "@/views/editor/app/component/tab/AppMenuTabQueries.vue";
import AppMenuTabMutations from "@/views/editor/app/component/tab/AppMenuTabMutations.vue";
import {CURRENT_USER} from "@/graphql/queries/user";
import {GET_PROJECT_BY_ID} from "@/graphql/queries/project";
import {GET_THEME_BY_ID} from "@/graphql/queries/theme";
import {GET_DATA_SOURCE_BY_ID} from "@/graphql/queries/datasource";
import {decodeDatasourceSecret} from "@/lib/schema";

export default Vue.extend({
  name: 'AppPage',
  components: {
    AppMenuTabMutations,
    AppMenuNavigation,
    AppMenuTabPages,
    AppMenuInfo,
    AppMenuTabTables,
    AppMenuTabQueries
  },
  data() {
    return {
      currentTab: 0,
      project: {},
      theme: {},
      datasource: {}
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
    }
  },
  async beforeMount() {
    this.currentTab = Number(this.$route.params.tab)
  }
})
</script>

<style scoped>

</style>