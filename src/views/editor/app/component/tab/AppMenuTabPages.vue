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

      <v-card v-else color="secondary" v-for="page in pages" :key="page.id" class="mt-3">
        <v-container fluid class="pl-6 pr-6">
          <v-row no-gutters>
            <v-col class="text-start ma-auto text-body-1">
              {{ page.name }}
            </v-col>

            <v-col class="text-end">
              <v-tooltip top color="accent" class="pa-4" min-width="600">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn small class="pa-4 mr-2" color="primary" v-bind="attrs" v-on="on">
                    {{ i18n('editor.pageUrl') }}
                  </v-btn>
                </template>

                <div class="text-start accent">
                  <div class="text-black">
                    /{{ page.name }}{{ getParamsDisplay(page.params) }}
                  </div>
                </div>
              </v-tooltip>
              <span class="text-body-2 text--secondary pr-6">
                {{ i18n('editor.modifyDate') }}: {{ page.modify_date }}
              </span>
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
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import LoadingCircular from "@/components/loading/LoadingCircular.vue";
import TitleCard from "@/components/card/TitleCard.vue";
import IconButton from "@/components/button/IconButton.vue";
import AppAddPageDialog from "@/views/editor/app/component/dialog/AppAddPageDialog.vue";
import AddItemCard from "@/components/card/AddItemCard.vue";
import DeleteConfirmationDialog from "@/components/dialog/DeleteConfirmationDialog.vue";
import {DELETE_PAGE, GET_PAGE_LIST_BY_PROJECT_ID} from "@/graphql/queries/page";

export default Vue.extend({
  name: 'AppMenuTabPages',
  components: {AddItemCard, DeleteConfirmationDialog, AppAddPageDialog, IconButton, TitleCard, LoadingCircular},
  props: {
    projectId: Number,
    datasourceId: Number
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
      this.$router.push({
        name: 'GuiEditor',
        params: {
          projectId: this.projectId.toString(),
          pageId: id.toString(),
          datasourceId: this.datasourceId.toString()
        }
      })
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
    },
    getParamsDisplay(params: string | undefined): string {
      if (params) {
        return '?' + params.split(';').map((param) => `${param}=:${param}`).join('&')
      }

      return ''
    }
  },
  apollo: {
    PAGE: {
      query: GET_PAGE_LIST_BY_PROJECT_ID,
      fetchPolicy: 'no-cache',
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
  }
})
</script>

<style scoped>

</style>