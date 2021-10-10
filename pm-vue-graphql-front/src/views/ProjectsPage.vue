<template>
  <v-container class="text-left">
    <h1>Projekty</h1>
    <ProjectCard title="Nowy prjekt"/>
  </v-container>
</template>

<script>
import ProjectCard from "@/components/projects/ProjectCard";

export default {
  name: 'ProjectsPage',
  components: {ProjectCard},
  methods: {

  }
}
</script>

<style scoped>

</style>