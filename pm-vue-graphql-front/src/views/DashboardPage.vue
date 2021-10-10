<template>
  <v-card class="dashboard__navigation--tabs">
    <v-tabs v-model="tab" background-color="secondary" centered dark icons-and-text fixed-tabs>
      <v-tabs-slider></v-tabs-slider>

      <v-tab href="#tab-1">
        {{ $t('dashboard.apps') }}
        <v-icon class="pb-2">fa-tablet</v-icon>
      </v-tab>

      <v-tab href="#tab-2">
        {{ $t('dashboard.dataSource') }}
        <v-icon class="pb-2">fa-database</v-icon>
      </v-tab>

      <v-tab href="#tab-3">
        {{ $t('dashboard.styles') }}
        <v-icon class="pb-2">fa-pencil-ruler</v-icon>
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item :value="'tab-1'">
        <v-card flat>
          <DashboardAppsTab/>
        </v-card>
      </v-tab-item>

      <v-tab-item :value="'tab-2'">
        <v-card flat>
          <DashboardDataTab/>
        </v-card>
      </v-tab-item>

      <v-tab-item :value="'tab-3'">
        <v-card flat>
          <DashboardStyleTab/>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
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