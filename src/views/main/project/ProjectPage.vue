<template>
  <v-container fluid>
    <LoadingDialog :dialog="saving" :title="i18n('project.saving')"/>

    <v-row class="mt-2 ml-2 mr-2">
      <v-col>
        <TitleCard :title="i18n('project.project')" icon="fa-tablet"/>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col>
        <ProjectForm :project-id="projectId" @saving="setSaving"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import LoadingDialog from "@/components/dialog/LoadingDialog.vue";
import ProjectForm from "@/views/main/project/component/ProjectForm.vue";
import TitleCard from "@/components/card/TitleCard.vue";

export default Vue.extend({
  name: 'ProjectPage',
  components: {TitleCard, ProjectForm, LoadingDialog},
  data() {
    return {
      saving: false
    }
  },
  computed: {
    projectId(): number {
      return Number(this.$route.params.projectId)
    }
  },
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    },
    setSaving(saving: boolean): void {
      this.saving = saving
    }
  }
})
</script>

<style scoped>

</style>