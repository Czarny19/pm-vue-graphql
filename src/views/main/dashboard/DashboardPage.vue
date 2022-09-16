<template>
  <div :key="$auth.isAuthenticated">
    <LoginDialog @signup="openSignUp"/>

    <SignUpDialog :dialog="signUpOpen" :user-id="userId"/>

    <template v-if="$auth.isAuthenticated">
      <DashboardNavigation :tab="currentTab" :projects="projects" :user="currentUser" @tabchange="setTab"/>
      <DashboardShortcuts/>

      <v-divider></v-divider>

      <v-container fluid class="pa-3">
        <v-row>
          <v-col>
            <DashboardProjectsTab
                v-if="currentTab === 0"
                :loading="loadingProjects || loadingThemes"
                :projects="projects"
                :themes="themes"
                @refresh="refreshProjects"
            />

            <DashboardThemesTab
                v-else-if="currentTab === 1"
                :loading="loadingThemes"
                :themes="themes"
                @refresh="refreshThemes"
            />

            <DashboardDatasourcesTab
                v-else
                :loading="loadingDatasources"
                :datasources="datasources"
                @refresh="refreshDatasources"
            />
          </v-col>
        </v-row>
      </v-container>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import DashboardNavigation from "@/views/main/dashboard/component/navigation/DashboardNavigation.vue";
import DashboardShortcuts from "@/views/main/dashboard/component/navigation/DashboardShortcuts.vue";
import DashboardProjectsTab from "@/views/main/dashboard/component/project/DashboardProjectsTab.vue";
import DashboardDatasourcesTab from "@/views/main/dashboard/component/datasource/DashboardDatasourcesTab.vue";
import DashboardThemesTab from "@/views/main/dashboard/component/theme/DashboardThemesTab.vue";
import LoginDialog from "@/components/login/LoginDialog.vue";
import SignUpDialog from "@/components/login/SignUpDialog.vue";
import {CURRENT_USER} from "@/graphql/queries/user";
import {GET_PROJECT_LIST_BY_USER_ID} from "@/graphql/queries/project";
import {GET_THEME_LIST_BY_USER_ID} from "@/graphql/queries/theme";
import {GET_DATA_SOURCE_LIST_BY_USER_ID} from "@/graphql/queries/datasource";
import {Datasource} from "@/lib/types";
import {decodeDatasourceSecret} from "@/lib/schema";

export default Vue.extend({
  name: 'DashboardPage',
  components: {
    DashboardShortcuts,
    SignUpDialog,
    LoginDialog,
    DashboardThemesTab,
    DashboardDatasourcesTab,
    DashboardProjectsTab,
    DashboardNavigation
  },
  data() {
    return {
      currentTab: 0,
      signUpOpen: false,
      userId: -1,
      currentUser: {},
      loadingProjects: true,
      loadingThemes: true,
      loadingDatasources: true,
      projects: [],
      themes: [],
      datasources: []
    }
  },
  methods: {
    setTab(tab: number): void {
      if (tab != undefined && tab !== this.currentTab) {
        this.currentTab = tab;
        this.$router.push({name: 'Dashboard', params: {tab: tab.toString()}});
      }
    },
    openSignUp(id: number): void {
      this.userId = id;
      this.signUpOpen = true;
    },
    refreshProjects(): void {
      this.$apollo.queries.PROJECT.refetch();
    },
    refreshThemes(): void {
      this.$apollo.queries.THEME.refetch();
    },
    refreshDatasources(): void {
      this.$apollo.queries.DATA_SOURCE.refetch();
    }
  },
  apollo: {
    currentUser: {
      query: CURRENT_USER
    },
    PROJECT: {
      query: GET_PROJECT_LIST_BY_USER_ID,
      fetchPolicy: 'network-only',
      variables(): { userId: number } {
        return {
          userId: this.currentUser.id
        }
      },
      skip(): boolean {
        return !this.currentUser || !this.currentUser.id;
      },
      result({data}): void {
        this.projects = data.PROJECT;
        this.loadingProjects = false;
      },
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
        return !this.currentUser || !this.currentUser.id;
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
        return !this.currentUser || !this.currentUser.id;
      },
      result({data}): void {
        this.datasources = data.DATA_SOURCE;
        this.datasources.forEach((ds: Datasource) => ds.secret = decodeDatasourceSecret(ds.secret ?? ''));
        this.loadingDatasources = false;
      }
    },
  },
  async beforeMount() {
    this.currentTab = Number(this.$route.params.tab);

    if (!this.currentUser) {
      this.$auth.logout();
    }
  }
})
</script>

<style scoped>

</style>