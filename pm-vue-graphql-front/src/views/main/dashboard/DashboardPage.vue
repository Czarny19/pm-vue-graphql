<template>
  <div>
    <LoginDialog @signup="openSignUp"/>

    <SignUpDialog :dialog="signUpOpen" :user-id="userId"/>

    <template v-if="$auth.isAuthenticated">
      <DashboardNavigation :tab="currentTab" @tabchange="setTab"/>

      <v-container fluid class="pa-4">
        <v-row>
          <v-col>
            <DashboardNavCard
                :title="i18n('dashboard.addProject')"
                :sub-title="i18n('dashboard.addProjectDesc')"
                icon="fa-tablet"
                :on-click="addProject">
            </DashboardNavCard>
          </v-col>
          <v-col>
            <DashboardNavCard
                :title="i18n('dashboard.addDatasource')"
                :sub-title="i18n('dashboard.addDatasourceDesc')"
                icon="fa-database"
                :on-click="addDatasource">
            </DashboardNavCard>
          </v-col>
          <v-col>
            <DashboardNavCard
                :title="i18n('dashboard.addTheme')"
                :sub-title="i18n('dashboard.addThemeDesc')"
                icon="fa-palette"
                :on-click="addTheme">
            </DashboardNavCard>
          </v-col>
        </v-row>
      </v-container>

      <v-divider></v-divider>

      <v-container fluid class="pa-4">
        <v-row>
          <v-col>
            <DashboardProjectsTab v-if="currentTab === 0"/>
            <DashboardThemesTab v-else-if="currentTab === 1"/>
            <DashboardDatasourcesTab v-else/>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import DashboardNavigation from "@/views/main/dashboard/component/navigation/DashboardNavigation.vue";
import DashboardNavCard from "@/views/main/dashboard/component/navigation/DashboardNavCard.vue";
import DashboardProjectsTab from "@/views/main/dashboard/component/tab/DashboardProjectsTab.vue";
import DashboardDatasourcesTab from "@/views/main/dashboard/component/tab/DashboardDatasourcesTab.vue";
import DashboardThemesTab from "@/views/main/dashboard/component/tab/DashboardThemesTab.vue";
import LoginDialog from "@/views/main/dashboard/component/login/LoginDialog.vue";
import SignUpDialog from "@/views/main/dashboard/component/login/SignUpDialog.vue";
import {CURRENT_USER} from "@/graphql/queries/user";

export default Vue.extend({
  name: 'DashboardPage',
  components: {
    SignUpDialog,
    LoginDialog,
    DashboardThemesTab,
    DashboardDatasourcesTab,
    DashboardProjectsTab,
    DashboardNavCard,
    DashboardNavigation
  },
  data() {
    return {
      currentTab: 0,
      signUpOpen: false,
      userId: -1,
      currentUser: {},
    }
  },
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    },
    setTab(tab: number): void {
      this.currentTab = tab
      this.$cookies.set('pmvg_dashtab', tab)
    },
    addProject(): void {
      this.$router.push({name: 'NewProject'})
    },
    addDatasource(): void {
      this.$router.push({name: 'NewDatasource'})
    },
    addTheme(): void {
      this.$router.push({name: 'NewTheme'})
    },
    openSignUp(id: number): void {
      this.userId = id
      this.signUpOpen = true
    }
  },
  apollo: {
    currentUser: {
      query: CURRENT_USER
    }
  },
  async beforeMount() {
    this.currentTab = Number(this.$cookies.get('pmvg_dashtab'))
  }
})
</script>

<style scoped>

</style>