<template>
  <div class="fill-height">
    <AppMenuNavigation @tabchange="changeTab"/>

    <div class="pa-4">
      <AppMenuInfo :project="project" :theme-name="theme.name" :datasource-name="datasource.name"/>
    </div>

    <v-divider></v-divider>

    <AppMenuTabPages v-if="currentTab === 0" :project-id="project.id" @openeditor="openGuiEditor"/>
    <AppMenuTabTables v-else-if="currentTab === 1" :datasource="datasource"/>
    <AppMenuTabQueries v-else-if="currentTab === 2" :datasource="datasource"/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {CURRENT_USER} from "@/graphql/queries/user";
import {GET_PROJECT_BY_ID} from "@/graphql/queries/project";
import {GET_THEME_BY_ID} from "@/graphql/queries/theme";
import {GET_DATA_SOURCE_BY_ID} from "@/graphql/queries/data_source";
import AppMenuNavigation from "@/views/editor/app/component/AppMenuNavigation.vue";
import AppMenuTabPages from "@/views/editor/app/component/tab/AppMenuTabPages.vue";
import AppMenuInfo from "@/views/editor/app/component/AppMenuInfo.vue";
import AppMenuTabTables from "@/views/editor/app/component/tab/AppMenuTabTables.vue";
import AppMenuTabQueries from "@/views/editor/app/component/tab/AppMenuTabQueries.vue";

export default Vue.extend({
  name: 'AppPage',
  components: {AppMenuNavigation, AppMenuTabPages, AppMenuInfo, AppMenuTabTables, AppMenuTabQueries},
  data() {
    return {
      currentTab: 0,
      projectId: -1,
      project: {},
      theme: {},
      datasource: {}
    }
  },
  methods: {
    changeTab(tab: number): void {
      this.currentTab = tab
    },
    openGuiEditor(pageId: string): void {
      this.$router.push({name: 'GuiEditor', params: {projectId: this.projectId.toString(), pageId: pageId}})
    }
  },
  apollo: {
    currentUser: {
      query: CURRENT_USER
    },
    PROJECT: {
      query: GET_PROJECT_BY_ID,
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
      fetchPolicy: 'network-only',
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
      fetchPolicy: 'network-only',
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
      }
    }
  },
  beforeMount() {
    this.projectId = Number(this.$route.params.projectId)
  }
})
</script>

<style scoped>

</style>