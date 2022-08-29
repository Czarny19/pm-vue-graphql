<template>
  <div>
    <AppAddPageDialog
        :dialog="addPageDialog"
        :project-id="projectId"
        @refresh="refresh"
        @close="closeAddPage">
    </AppAddPageDialog>

    <DeleteConfirmationDialog :dialog="deleteDialog" @confirm="deletePage" @cancel="cancelDeletePage"/>

    <v-container fluid class="pa-3">
      <TitleCard :title="i18n('editor.pages')" icon="fa-file"/>
      <AddItemCard v-if="!loading" :label="i18n('editor.addPage')" @add="addPage"/>
      <LoadingCircular v-if="loading"/>
      <AppMenuPagesList
          v-else
          :project-id="projectId"
          :datasource-id="datasourceId"
          :pages="pages"
          @delete="deletePageClicked">
      </AppMenuPagesList>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import LoadingCircular from "@/components/loading/LoadingCircular.vue";
import TitleCard from "@/components/card/TitleCard.vue";
import AppMenuPagesList from "@/views/editor/app/component/pages/AppMenuPagesList.vue";
import AppAddPageDialog from "@/views/editor/app/component/pages/AppAddPageDialog.vue";
import AddItemCard from "@/components/card/AddItemCard.vue";
import DeleteConfirmationDialog from "@/components/dialog/DeleteConfirmationDialog.vue";
import {DELETE_PAGE} from "@/graphql/queries/page";

export default Vue.extend({
  name: 'AppMenuTabPages',
  components: {
    AppMenuPagesList,
    AddItemCard,
    DeleteConfirmationDialog,
    AppAddPageDialog,
    TitleCard,
    LoadingCircular
  },
  props: {
    loading: Boolean,
    pages: Array,
    projectId: Number,
    datasourceId: Number
  },
  data() {
    return {
      addPageDialog: false,
      deleteDialog: false,
      deleteId: -1,
    }
  },
  methods: {
    addPage(): void {
      this.addPageDialog = true
    },
    closeAddPage(): void {
      this.addPageDialog = false
    },
    refresh(): void {
      this.$apollo.queries.PAGE.refetch()
    },
    deletePageClicked(id: number): void {
      this.deleteId = id
      this.deleteDialog = true
    },
    cancelDeletePage(): void {
      this.deleteId = -1
      this.deleteDialog = false
    },
    deletePage(): void {
      this.deleteDialog = false

      this.$apollo.mutate({mutation: DELETE_PAGE, variables: {id: this.deleteId}}).then(() => {
        this.$apollo.queries.PAGE.refetch()
      })
    }
  }
})
</script>

<style scoped>

</style>