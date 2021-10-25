<template>
  <v-container>
    <LoadingDialog :dialog="saving" :title="$t('project.saving')"/>

    <v-row>
      <v-col cols="12" sm="12" md="8" lg="8" xl="8">
        <ProjectForm :project-id="projectId" @saving="setSaving"/>
      </v-col>
      <v-col cols="12" sm="12" md="4" lg="4" xl="4">
        <ProjectInfo/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LoadingDialog from "@/components/LoadingDialog";
import ProjectForm from "@/views/project/components/ProjectForm";
import ProjectInfo from "@/views/project/components/ProjectInfo";

export default {
  name: 'ProjectPage',
  components: {ProjectInfo, ProjectForm, LoadingDialog},
  data() {
    return {
      saving: false
    }
  },
  computed: {
    projectId() {
      return this.$route.params.projectId ? parseInt(this.$route.params.projectId) : null
    }
  },
  methods: {
    setSaving(saving) {
      this.saving = saving
    }
  }
}
</script>

<style scoped>

</style>