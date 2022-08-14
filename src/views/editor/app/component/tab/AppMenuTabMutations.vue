<template>
  <div>
    <AppAddMutationDialog
        :dialog="addMutationDialog"
        :datasource-id="datasource.id"
        :tables="tables"
        @refresh="refresh"
        @close="closeAddMutation">
    </AppAddMutationDialog>

    <DeleteConfirmationDialog :dialog="deleteDialog" @confirm="deleteMutation" @cancel="cancelDeleteMutation"/>

    <v-container fluid class="pa-3">
      <TitleCard :title="i18n('editor.mutations')" icon="fa-bolt"/>

      <template v-if="datasourceSet">
        <AddItemCard v-if="!loading" :label="i18n('editor.addMutation')" @add="addMutation"/>

        <LoadingCircular v-if="loading"/>

        <v-card v-else color="secondary" v-for="mutation in mutations" :key="mutation.id" class="mt-3">
          <v-container fluid class="pl-6 pr-6">
            <v-row no-gutters>
              <v-col class="text-start ma-auto text-body-1">
                {{ mutation.name }}
              </v-col>

              <v-col class="text-end">
                   <span class="text-body-2 text--secondary pr-6">
                  {{ i18n('editor.modifyDate') }}: {{ mutation.modify_date }}
                </span>
                <IconButton
                    :label="i18n('common.edit')"
                    icon="fa-edit"
                    color="info"
                    @click="openMutation(mutation.id)">
                </IconButton>
                <IconButton
                    class="ml-6"
                    :label="i18n('common.delete')"
                    icon="fa-trash-can"
                    color="error"
                    @click="deleteMutationClicked(mutation.id)">
                </IconButton>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </template>

      <AppMenuNoDatasource v-else/>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import AppMenuNoDatasource from "@/views/editor/app/component/AppMenuNoDatasource.vue";
import DeleteConfirmationDialog from "@/components/dialog/DeleteConfirmationDialog.vue";
import TitleCard from "@/components/card/TitleCard.vue";
import AddItemCard from "@/components/card/AddItemCard.vue";
import LoadingCircular from "@/components/loading/LoadingCircular.vue";
import AppAddMutationDialog from "@/views/editor/app/component/dialog/AppAddMutationDialog.vue";
import IconButton from "@/components/button/IconButton.vue";
import {SchemaItem} from "@/lib/types";
import {getCleanGraphQLSchema} from "@/lib/schema";
import {DELETE_MUTATION, GET_MUTATION_LIST_BY_DATA_SOURCE_ID} from "@/graphql/queries/mutation";

export default Vue.extend({
  name: 'AppMenuTabMutations',
  components: {
    IconButton,
    AppAddMutationDialog,
    LoadingCircular,
    AddItemCard,
    TitleCard,
    DeleteConfirmationDialog,
    AppMenuNoDatasource
  },
  props: {
    datasource: Object
  },
  data() {
    return {
      loading: true,
      addMutationDialog: false,
      mutations: [],
      deleteDialog: false,
      deleteId: -1,
      schema: []
    }
  },
  computed: {
    datasourceSet(): boolean {
      return Object.keys(this.datasource).length !== 0
    },
    tables(): string [] {
      return (this.schema as SchemaItem[]).map(table => table.name)
    }
  },
  methods: {
    addMutation(): void {
      this.addMutationDialog = true
    },
    closeAddMutation(): void {
      this.addMutationDialog = false
    },
    refresh(): void {
      this.$apollo.queries.MUTATION.refetch()
    },
    openMutation(id: number): void {
      this.$router.push({
        name: 'Mutation', params: {
          datasourceId: this.datasource.id.toString(),
          mutationId: id.toString()
        }
      })
    },
    deleteMutationClicked(id: number): void {
      this.deleteId = id
      this.deleteDialog = true
    },
    cancelDeleteMutation(): void {
      this.deleteId = -1
      this.deleteDialog = false
    },
    deleteMutation(): void {
      this.deleteDialog = false

      this.$apollo.mutate({mutation: DELETE_MUTATION, variables: {id: this.deleteId}}).then(() => {
        this.$apollo.queries.MUTATION.refetch()
      })
    }
  },
  apollo: {
    MUTATION: {
      query: GET_MUTATION_LIST_BY_DATA_SOURCE_ID,
      fetchPolicy: 'network-only',
      variables(): { datasourceId: number } {
        return {
          datasourceId: this.datasource.id
        }
      },
      skip(): boolean {
        return !this.datasourceSet
      },
      result({data}): void {
        this.mutations = data.MUTATION
        this.loading = false
      }
    }
  },
  beforeMount() {
    getCleanGraphQLSchema(this.datasource.address, this.datasource.secret).then((result) => {
      (this.schema as SchemaItem[]) = result.schema
    })
  }
})
</script>

<style scoped>

</style>