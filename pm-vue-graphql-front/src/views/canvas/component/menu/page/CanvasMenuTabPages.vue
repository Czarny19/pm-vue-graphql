<template>
  <div>
    <CanvasMenuAddPageDialog
        :dialog="addPageDialog"
        :project-id="projectId"
        @refresh="refresh"
        @close="closeAddPage">
    </CanvasMenuAddPageDialog>

    <DeleteConfirmationDialog :dialog="deleteDialog" @confirm="deletePage" @cancel="cancelDeletePage"/>

    <v-container fluid class="pa-4">
      <TitleCard :title="i18n('canvas.page')" icon="fa-file"/>

      <v-card class="mt-4" v-if="loading" color="primary">
        <LoadingCircular/>
      </v-card>

      <template v-else>
        <v-card color="secondary" class="mt-3" @click="addPage">
          <v-container fluid class="pl-6 pr-6 pt-5 pb-5 text-start ma-auto">
            <v-icon class="mr-5">fa-circle-plus</v-icon>
            {{ i18n('canvas.addPage') }}
          </v-container>
        </v-card>

        <v-card color="secondary" v-for="page in pages" :key="page.id" class="mt-3">
          <v-container fluid class="pl-6 pr-6">
            <v-row no-gutters>
              <v-col class="text-start ma-auto">
                {{ page.name }}
              </v-col>
              <v-col class="text-start ma-auto">
                {{ i18n('canvas.modifyDate') }}: {{ page.modify_date }}
              </v-col>
              <v-col class="text-end">
                <IconButton
                    :label="i18n('common.edit')"
                    icon="fa-edit"
                    color="info"
                    @click="openEditor(page.id)">
                </IconButton>
                <IconButton
                    class="ml-6"
                    :label="i18n('common.delete')"
                    icon="fa-trash-can"
                    color="error"
                    @click="deletePageClicked(page.id)">
                </IconButton>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </template>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import LoadingCircular from "@/components/loading/LoadingCircular.vue";
import TitleCard from "@/components/card/TitleCard.vue";
import IconButton from "@/components/button/IconButton.vue";
import CanvasMenuAddPageDialog from "@/views/canvas/component/menu/page/CanvasMenuAddPageDialog.vue";
import DeleteConfirmationDialog from "@/components/dialog/DeleteConfirmationDialog.vue";
import {DELETE_PAGE, GET_PAGES_FOR_PROJECT} from "@/graphql/queries/page";

export default Vue.extend({
  name: 'CanvasMenuTabPages',
  components: {DeleteConfirmationDialog, CanvasMenuAddPageDialog, IconButton, TitleCard, LoadingCircular},
  props: {
    projectId: Number
  },
  data() {
    return {
      loading: true,
      addPageDialog: false,
      pages: [],
      deleteDialog: false,
      deleteId: -1,
    }
  },
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    },
    addPage(): void {
      this.addPageDialog = true
    },
    closeAddPage(): void {
      this.addPageDialog = false
    },
    refresh(): void {
      this.$apollo.queries.PAGE.refetch()
    },
    openEditor(id: number): void {
      this.$emit('openeditor', id)
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

      this.$apollo.mutate({
        mutation: DELETE_PAGE,
        variables: {
          id: this.deleteId
        }
      }).then(() => {
        this.$apollo.queries.PAGE.refetch()
      })
    }
  },
  apollo: {
    PAGE: {
      query: GET_PAGES_FOR_PROJECT,
      fetchPolicy: 'network-only',
      variables(): { projectId: number } {
        return {
          projectId: this.projectId
        }
      },
      skip(): boolean {
        return !this.projectId
      },
      result({data}): void {
        this.pages = data.PAGE
        this.loading = false
      }
    }
  },
})
</script>

<style scoped>

</style>