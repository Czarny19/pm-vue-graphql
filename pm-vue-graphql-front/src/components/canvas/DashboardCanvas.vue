<template>
  <div>
    <v-toolbar max-height="40px">
      <v-spacer/>
      <div>{{projectName}} > {{currentPage.title}}</div>
    </v-toolbar>
  </div>
</template>

<script>
import Page from "@/models/page";

export default {
  name: 'DashboardCanvas',
  props: {
    projectName: String,
    currentPage: Page
  }
}
</script>

<style scoped>

</style>