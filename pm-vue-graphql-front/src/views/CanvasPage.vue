<template>
  <div>
    <DashboardTopBar/>
    <v-container fluid class="dashboard__sidebar--wrapper pa-0">
      <v-row no-gutters>
        <v-col cols="2">
          <DashboardComponentBar/>
        </v-col>
        <v-col cols="8">
          <DashboardCanvas :project-name="project.title"/>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import DashboardComponentBar from "@/components/canvas/DashboardComponentBar";
import DashboardTopBar from "@/components/canvas/DashboardTopBar";
import DashboardCanvas from "@/components/canvas/DashboardCanvas";
import Project from "@/models/project";

export default {
  name: 'CanvasPage',
  components: {DashboardCanvas, DashboardTopBar, DashboardComponentBar},
  data: () => ({
    currentTab: 0,
    project: {}
  }),
  beforeMount() {
    // tODO load project
    this.project = new Project({id: 0, title: 'Project 1'})
  }
}
</script>

<style scoped>

</style>