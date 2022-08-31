<template>
  <v-card color="primary">
    <v-card-title>{{ i18n('editor.startPage') }}</v-card-title>

    <v-card-text class="pb-0">
      <v-select
          class="pa-0"
          color="accent"
          item-color="accent"
          v-model="currentProject.start_page"
          :items="['', ...pages]"
          item-value="id"
          item-text="name"
          required
          append-icon="fa-chevron-down"
          @change="changed=true">
      </v-select>
    </v-card-text>

    <v-card-actions v-if="changed" class="pa-4 text-end">
      <IconButton :label="i18n('common.save')" color="success" icon="fa-save" @click="updateStartPage"/>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import {UPDATE_PROJECT_START_PAGE} from "@/graphql/queries/project";
import IconButton from "@/components/button/IconButton.vue";

export default Vue.extend({
  name: 'AppMenuSettingStartPage',
  components: {IconButton},
  props: {
    project: Object,
    pages: Array
  },
  data() {
    return {
      currentProject: {},
      changed: false
    }
  },
  methods: {
    updateStartPage(): void {
      this.$apollo.mutate({
        mutation: UPDATE_PROJECT_START_PAGE,
        variables: {
          id: this.project.id,
          startPage: this.project.start_page
        }
      }).then(async () => {
        this.changed = false
      }).catch(() => {
        this.changed = false
      })
    }
  },
  beforeMount() {
    this.currentProject = this.project
  }
})
</script>

<style scoped>

</style>