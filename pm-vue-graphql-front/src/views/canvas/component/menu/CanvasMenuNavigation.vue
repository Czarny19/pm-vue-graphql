<template>
  <v-navigation-drawer permanent app clipped width="340" color="secondary">
    <v-list-item class="pl-6 pr-6 pt-2 pb-2 primary">
      <v-list-item-content>
        <v-list-item-title class="text-h6 text-start mb-2">
          {{ currentUser.username }}
        </v-list-item-title>
        <v-list-item-subtitle class="text-body-1 text-start">
          {{ currentUser.email }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list nav>
      <v-list-item-group v-model="currentTab" color="accent">
        <v-list-item v-for="item in navItems" :key="item.title" link class="pl-6 pr-6">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="text-body-1 text-start">{{ item.title }}</v-list-item-title>
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
  name: 'CanvasMenuNavigation',
  data() {
    return {
      currentTab: 0,
      currentUser: {id: -1},
      projects: [],
      navItems: [
        {title: this.$t('canvas.page'), icon: 'fa-file'}
      ]
    }
  },
  watch: {
    currentTab(): void {
      this.$emit('tabchange', this.currentTab)
    }
  },
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
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