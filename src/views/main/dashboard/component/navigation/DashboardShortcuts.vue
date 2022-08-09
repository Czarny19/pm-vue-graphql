<template>
  <v-container fluid class="pa-3">
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
</template>

<script lang="ts">
import Vue from "vue";
import DashboardNavCard from "@/views/main/dashboard/component/navigation/DashboardNavCard.vue";

export default Vue.extend({
  name: 'DashboardShortcuts',
  components: {DashboardNavCard},
  methods: {
    addProject(): void {
      this.$router.push({name: 'NewProject'})
    },
    addDatasource(): void {
      this.$router.push({name: 'NewDatasource'})
    },
    addTheme(): void {
      this.$router.push({name: 'NewTheme'})
    }
  }
})
</script>

<style scoped>

</style>