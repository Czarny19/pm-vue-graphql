<template>
  <v-card color="primary">
    <v-card-title>
      <v-switch
          class="pt-2"
          color="success"
          v-model="currentProject.running"
          :label="i18n('editor.running')"
          @change="changed=true"
      />

      <v-spacer></v-spacer>

      <IconButton color="success" :label="i18n('editor.openApp')" icon="fa-globe" @click="openApp"/>
    </v-card-title>

    <v-card-actions v-if="changed" class="pa-4 text-end">
      <IconButton :label="i18n('common.save')" color="success" icon="fa-save" @click="updateRunning"/>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import {UPDATE_PROJECT_RUNNING} from "@/graphql/queries/project";
import IconButton from "@/components/button/IconButton.vue";
import {AppProject} from "@/lib/types";

export default Vue.extend({
  name: 'AppMenuSettingRunning',
  components: {IconButton},
  props: {
    project: Object
  },
  data() {
    return {
      currentProject: {},
      changed: false
    }
  },
  methods: {
    updateRunning(): void {
      this.$apollo.mutate({
        mutation: UPDATE_PROJECT_RUNNING,
        variables: {id: this.project.id, running: (this.currentProject as AppProject).running}
      }).then(async () => {
        this.changed = false;
      }).catch(() => {
        this.changed = false;
      });
    },
    openApp(): void {
      this.$router.push({name: 'AppRunner', params: {projectId: this.project.id, pageId: 'start'}});
    }
  },
  beforeMount() {
    this.currentProject = this.project;
  }
})
</script>

<style scoped>

</style>