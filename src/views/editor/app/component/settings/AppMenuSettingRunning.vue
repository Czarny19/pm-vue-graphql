<template>
  <v-card color="primary">
    <v-card-title v-if="initialized">
      <v-switch class="pt-2" color="info" v-model="running" :label="i18n('editor.running')"/>
    </v-card-title>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import {UPDATE_PROJECT_RUNNING} from "@/graphql/queries/project";

export default Vue.extend({
  name: 'AppMenuSettingRunning',
  props: {
    project: Object
  },
  data() {
    return {
      running: false,
      initialized: false
    }
  },
  watch: {
    running() {
      if (!this.initialized) {
        this.initialized = true
        return
      }

      this.$apollo.mutate({
        mutation: UPDATE_PROJECT_RUNNING,
        variables: {id: this.project.id, running: this.running}
      })
    }
  },
  beforeMount() {
    this.running = this.project.running

    if (!this.running) {
      this.initialized = true
    }
  }
})
</script>

<style scoped>

</style>