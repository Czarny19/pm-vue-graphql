<template>
  <div>
    <v-app-bar color="primary" app clipped-left>
      <v-avatar color="accent" class="mr-6" size="40">
        <v-icon color="primary" size="24">fa-pencil-ruler</v-icon>
      </v-avatar>
      <v-toolbar-title class="text-h5" style="cursor: pointer" @click="openDashboard">
        {{ i18n('title') }}
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-menu v-if="$auth.isAuthenticated" offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on">
            {{ i18n('user.user') }}
            <v-icon class="ml-4">fa-user-circle</v-icon>
          </v-btn>
        </template>
        <v-list class="pa-4">
          <v-list-item-title class="text-h6 text-start">
            {{ currentUser.username }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-body-1 text-start">
            {{ currentUser.email }}
          </v-list-item-subtitle>
          <v-list-item class="text-start pt-4 pl-0">
            <v-btn color="error" @click="logout" min-width="140">{{ i18n('user.logout') }}</v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {CURRENT_USER} from "@/graphql/queries/user";

export default Vue.extend({
  name: 'AppBar',
  computed: {
    i18n() {
      return this.$t
    }
  },
  data() {
    return {
      currentUser: []
    }
  },
  methods: {
    openDashboard() {
      this.$router.push({name: 'Dashboard'})
    },
    logout() {
      this.$cookies.remove('pmvg_dashtab')
      localStorage.clear()
      this.$auth.logout()
    }
  },
  apollo: {
    currentUser: {
      query: CURRENT_USER
    }
  }
})
</script>

<style scoped>

</style>