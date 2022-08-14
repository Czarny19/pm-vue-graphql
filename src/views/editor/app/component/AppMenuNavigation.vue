<template>
  <v-navigation-drawer permanent app clipped color="primary">
    <v-list-item class="pl-6 pr-6 pt-2 pb-2 primary">
      <v-list-item-content>
        <v-list-item-title class="text-body-1 text-start mb-2">
          {{ currentUser.username }}
        </v-list-item-title>
        <v-list-item-subtitle class="text-body-2 text-start">
          {{ currentUser.email }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list nav color="primary">
      <v-list-item-group v-model="currentTab" color="accent">
        <v-list-item v-for="item in navItems" :key="item.title" link class="pl-4 pr-4">
          <v-list-item-icon class="pa-0 ma-auto">
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content class="pl-4 pr-4 pt-2 pb-2">
            <v-list-item-title class="text-body-2 text-start">{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from "vue";
import {CURRENT_USER} from "@/graphql/queries/user";

export default Vue.extend({
  name: 'AppMenuNavigation',
  data() {
    return {
      currentTab: 0,
      currentUser: {id: -1},
      projects: []
    }
  },
  computed: {
    navItems(): { title: string, icon: string }[] {
      return [
        {title: this.$t('editor.pages').toString(), icon: 'fa-file-pen'},
        {title: this.$t('editor.tables').toString(), icon: 'fa-table'},
        {title: this.$t('editor.queries').toString(), icon: 'fa-terminal'},
        {title: this.$t('editor.mutations').toString(), icon: 'fa-bolt'}
      ]
    }
  },
  watch: {
    currentTab(): void {
      this.$emit('tabchange', this.currentTab)
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