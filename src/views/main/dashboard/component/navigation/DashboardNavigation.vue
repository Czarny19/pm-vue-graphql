<template>
  <v-navigation-drawer permanent app clipped color="primary">
    <v-list-item class="pl-6 pr-6 pt-2 pb-2 primary">
      <v-list-item-content>
        <v-list-item-title class="text-body-1 text-start mb-2">
          {{ user.username }}
        </v-list-item-title>
        <v-list-item-subtitle class="text-body-2 text-start">
          {{ user.email }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <div class="secondary text-start text-body-2 pa-3 pl-6">
      {{ i18n('dashboard.dashboard') }}
    </div>

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

    <div class="secondary text-start text-body-2 pa-3 pl-6">
      {{ i18n('dashboard.editor') }}
    </div>

    <v-list nav color="primary">
      <v-list-item-group color="accent">
        <v-list-item v-for="project in projects" :key="project.title" link class="pl-4" @click="openApp(project.id)">
          <v-list-item-content class="pt-0 pb-0">
            <v-list-item-title class="text-body-2 text-start">
              {{ project.name }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'DashboardNavigation',
  props: {
    tab: Number,
    projects: Array,
    user: Object
  },
  data() {
    return {
      currentTab: 0
    }
  },
  computed: {
    navItems(): { title: string, icon: string }[] {
      return [
        {title: this.$t('dashboard.projects').toString(), icon: 'fa-tablet'},
        {title: this.$t('dashboard.themes').toString(), icon: 'fa-palette'},
        {title: this.$t('dashboard.datasources').toString(), icon: 'fa-database'}
      ]
    }
  },
  methods: {
    openApp(id: string): void {
      this.$router.push({name: 'App', params: {projectId: id, tab: '0'}})
    }
  },
  watch: {
    currentTab(): void {
      this.$emit('tabchange', this.currentTab)
    }
  },
  async beforeMount() {
    this.currentTab = this.tab
  }
})
</script>

<style scoped>

</style>