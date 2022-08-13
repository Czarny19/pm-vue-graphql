<template>
  <div>
    <DeleteConfirmationDialog :dialog="deleteDialog" @confirm="deleteProject" @cancel="cancelDeleteProject"/>

    <InfoDialog
        :dialog="warningDialog"
        :title="i18n('dashboard.projectThemeWarning')"
        :msg="i18n('dashboard.projectThemeRequired')"
        @close="closeWarningDialog">
    </InfoDialog>

    <TitleCard :title="i18n('dashboard.projects')" icon="fa-tablet"/>
    <AddItemCard :label="i18n('dashboard.addProject')" @add="createProject"/>

    <LoadingCircular v-if="loading"/>
    <DashboardTabNoData v-else-if="!projects.length && !loading" :msg="i18n('dashboard.noProjects')"/>

    <DashboardProjectsList v-if="projects.length && !loading" :projects="projects" @delete="deleteProjectClicked"/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import DeleteConfirmationDialog from "@/components/dialog/DeleteConfirmationDialog.vue";
import TitleCard from "@/components/card/TitleCard.vue";
import LoadingCircular from "@/components/loading/LoadingCircular.vue";
import DashboardTabNoData from "@/views/main/dashboard/component/tab/DashboardTabNoData.vue";
import InfoDialog from "@/components/dialog/InfoDialog.vue";
import AddItemCard from "@/components/card/AddItemCard.vue";
import DashboardProjectsList from "@/views/main/dashboard/component/project/DashboardProjectsList.vue";
import {DELETE_PROJECT} from "@/graphql/queries/project";

export default Vue.extend({
  name: 'DashboardProjectsTab',
  components: {
    DashboardProjectsList,
    AddItemCard,
    InfoDialog,
    DashboardTabNoData,
    LoadingCircular,
    TitleCard,
    DeleteConfirmationDialog
  },
  props: {
    loading: Boolean,
    projects: Array,
    themes: Array
  },
  data() {
    return {
      warningDialog: false,
      deleteDialog: false,
      deleteId: -1
    }
  },
  methods: {
    createProject(): void {
      if (this.themes.length === 0) {
        this.warningDialog = true
        return
      }

      this.$router.push({name: 'NewProject'})
    },
    deleteProjectClicked(id: number): void {
      this.deleteId = id
      this.deleteDialog = true
    },
    cancelDeleteProject(): void {
      this.deleteId = -1
      this.deleteDialog = false
    },
    deleteProject(): void {
      this.deleteDialog = false

      this.$apollo.mutate({mutation: DELETE_PROJECT, variables: {id: this.deleteId}}).then(() => {
        this.$emit('refresh')
      })
    },
    closeWarningDialog(): void {
      this.warningDialog = false
    }
  }
})
</script>

<style scoped>

</style>