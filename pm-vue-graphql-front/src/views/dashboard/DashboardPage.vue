<template>
  <v-card class="ma-4" color="accent">
    <v-card-title>
      {{ $t('dashboard.dashboard') }}
    </v-card-title>
    <div>
      <v-row no-gutters>
        <v-col cols="12" sm="12" md="12" lg="5" xl="5" class="pb-2 pr-2 pl-2">
          <DashboardProjectsTab/>
        </v-col>
        <v-col cols="12" sm="12" md="12" lg="4" xl="4" class="pb-2 pr-2 pl-2">
          <DashboardDataTab/>
        </v-col>
        <v-col cols="12" sm="12" md="12" lg="3" xl="3" class="pb-2 pr-2 pl-2">
          <DashboardThemesTab/>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script>
import DashboardProjectsTab from "@/views/dashboard/components/tabs/DashboardProjectsTab";
import DashboardDataTab from "@/views/dashboard/components/tabs/DashboardDataTab";
import DashboardThemesTab from "@/views/dashboard/components/tabs/DashboardThemesTab";

export default {
  name: 'DashboardPage',
  components: {DashboardThemesTab, DashboardDataTab, DashboardProjectsTab}
}
</script>

<style scoped>

</style>