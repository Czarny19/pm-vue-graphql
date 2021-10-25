<template>
  <div class="overflow-hidden">
    <v-app-bar color="primary">
      <v-toolbar-title class="app-bar__title" @click="openDashboard">{{ $t('title') }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-icon class="app-bar__user--icon">fa-user</v-icon>
      <div class="app-bar__user--email">{{ currentUser.email }}</div>
    </v-app-bar>
  </div>
</template>

<script>
import {CURRENT_USER} from "@/graphql/queries/user";

export default {
  name: 'AppBar',
  data() {
    return {
      currentUser: []
    }
  },
  methods: {
    openDashboard() {
      this.$router.push({name: 'Dashboard'})
    }
  },
  apollo: {
    currentUser: {
      query: CURRENT_USER
    }
  }
}
</script>

<style scoped>

</style>