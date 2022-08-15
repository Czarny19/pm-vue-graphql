<template>
  <v-app-bar color="primary" app clipped-left>
    <v-avatar color="accent" class="mr-6" size="32">
      <v-icon color="primary" size="18">fa-pencil-ruler</v-icon>
    </v-avatar>
    <v-toolbar-title class="text-h6 pointer" @click="openDashboard">
      {{ i18n('title') }}
    </v-toolbar-title>
    <v-spacer></v-spacer>

    <IconButton
        :label="i18n('user.logout')"
        color="secondary"
        icon="fa-arrow-right-from-bracket"
        @click="logout">
    </IconButton>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from "vue";
import IconButton from "@/components/button/IconButton.vue";

export default Vue.extend({
  name: 'AppBar',
  components: {IconButton},
  methods: {
    openDashboard() {
      this.$router.push({name: 'Dashboard', params: {tab: '0'}})
    },
    logout() {
      localStorage.clear()
      this.$auth.logout()
    }
  }
})
</script>

<style scoped>

</style>