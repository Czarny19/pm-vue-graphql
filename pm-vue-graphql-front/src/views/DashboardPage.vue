<template>
  <v-card class="ma-4" color="accent">
    <v-card-title>
      {{ $t('dashboard.dashboard') }}
    </v-card-title>
    <div>
      <v-row no-gutters>
        <v-col cols="12" sm="12" md="12" lg="5" xl="5" class="pb-2 pr-2 pl-2">
          <DashboardAppsTab/>
        </v-col>
        <v-col cols="12" sm="12" md="12" lg="4" xl="4" class="pb-2 pr-2 pl-2">
          <DashboardDataTab/>
        </v-col>
        <v-col cols="12" sm="12" md="12" lg="3" xl="3" class="pb-2 pr-2 pl-2">
          <DashboardStyleTab/>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script>
import DashboardAppsTab from "@/components/dashboard/DashboardAppsTab";
import DashboardDataTab from "@/components/dashboard/DashboardDataTab";
import DashboardStyleTab from "@/components/dashboard/DashboardStyleTab";

export default {
  name: 'DashboardPage',
  components: {DashboardStyleTab, DashboardDataTab, DashboardAppsTab},
  data: () => ({
    tab: 1,
  }),
  methods: {}
}
</script>

<style scoped>

</style>