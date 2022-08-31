<template>
  <v-app-bar :color="theme.primary_color" app clipped-left>
    <v-toolbar-title class="text-h6 pointer" @click="goToStart">
      {{ project.name }}
    </v-toolbar-title>

    <v-toolbar-items class="ml-16">
      <v-btn
          v-for="(item, index) in project.top_nav_items.items"
          min-width="100"
          text
          :key="index"
          @click="goToPage(item.page)">
        {{ item.name }}
      </v-btn>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'AppRunnerTopNav',
  props: {
    project: Object,
    theme: Object
  },
  methods: {
    goToStart(): void {
      this.$router.push({name: 'AppRunner', params: {projectId: this.project.id}})
    },
    goToPage(id: number): void {
      this.$router.push({name: 'AppRunner', params: {projectId: this.project.id, pageId: id.toString()}})
    }
  }
})
</script>

<style scoped>

</style>