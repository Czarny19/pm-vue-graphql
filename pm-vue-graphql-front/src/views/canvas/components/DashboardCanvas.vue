<template>
  <div>
    <v-toolbar max-height="40px">
      <v-spacer/>
      <div>{{projectName}} > {{currentPage.title}}</div>
    </v-toolbar>
  </div>
</template>

<script>
export default {
  name: 'DashboardCanvas',
  props: {
    projectName: String,
    currentPage: Object
  }
}
</script>

<style scoped>

</style>