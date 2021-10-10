<template>
  <v-card>
    <v-card-title @click="openDashboard">{{ title }}</v-card-title>
  </v-card>
</template>

<script>
export default {
  name: 'ProjectCard',
  props: {
    title: String,
    icon: String
  },
  methods: {
    openDashboard() {
      this.$router.push({name: 'Dashboard'})
    }
  }
}
</script>

<style scoped>

</style>