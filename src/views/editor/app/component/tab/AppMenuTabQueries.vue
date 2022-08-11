<template>
  <div>
    <AppAddQueryDialog
        :dialog="addQueryDialog"
        :datasource-id="datasource.id"
        :tables="tables"
        @refresh="refresh"
        @close="closeAddQuery">
    </AppAddQueryDialog>

    <DeleteConfirmationDialog :dialog="deleteDialog" @confirm="deleteQuery" @cancel="cancelDeleteQuery"/>

    <v-container fluid class="pa-3">
      <TitleCard :title="i18n('editor.queries')" icon="fa-terminal"/>

      <template v-if="datasourceSet">
        <AddItemCard v-if="!loading" :label="i18n('editor.addQuery')" @add="addQuery"/>

        <LoadingCircular v-if="loading"/>

        <v-card v-else color="secondary" v-for="query in queries" :key="query.id" class="mt-3">
          <v-container fluid class="pl-6 pr-6">
            <v-row no-gutters>
              <v-col class="text-start ma-auto text-body-1">
                {{ query.name }}
              </v-col>

              <v-col class="text-end">
                   <span class="text-body-2 text--secondary pr-6">
                  {{ i18n('editor.modifyDate') }}: {{ query.modify_date }}
                </span>
                <IconButton
                    :label="i18n('common.edit')"
                    icon="fa-edit"
                    color="info"
                    @click="openQuery(query.id)">
                </IconButton>
                <IconButton
                    class="ml-6"
                    :label="i18n('common.delete')"
                    icon="fa-trash-can"
                    color="error"
                    @click="deleteQueryClicked(query.id)">
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
import TitleCard from "@/components/card/TitleCard.vue";
import DeleteConfirmationDialog from "@/components/dialog/DeleteConfirmationDialog.vue";
import LoadingCircular from "@/components/loading/LoadingCircular.vue";
import IconButton from "@/components/button/IconButton.vue";
import AppAddQueryDialog from "@/views/editor/app/component/dialog/AppAddQueryDialog.vue";
import AddItemCard from "@/components/card/AddItemCard.vue";
import AppMenuNoDatasource from "@/views/editor/app/component/AppMenuNoDatasource.vue";
import {DELETE_QUERY, GET_QUERY_LIST_BY_DATA_SOURCE_ID} from "@/graphql/queries/query";
import {getCleanGraphQLSchema} from "@/lib/schema";
import {SchemaItem} from "@/lib/types";

export default Vue.extend({
  name: 'AppMenuTabQueries',
  components: {
    AppMenuNoDatasource,
    AddItemCard,
    AppAddQueryDialog,
    IconButton,
    LoadingCircular,
    DeleteConfirmationDialog,
    TitleCard
  },
  props: {
    datasource: Object
  },
  data() {
    return {
      loading: true,
      addQueryDialog: false,
      queries: [],
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
    addQuery(): void {
      this.addQueryDialog = true
    },
    closeAddQuery(): void {
      this.addQueryDialog = false
    },
    refresh(): void {
      this.$apollo.queries.QUERY.refetch()
    },
    openQuery(id: number): void {
      this.$router.push({name: 'Query', params: {datasourceId: this.datasource.id.toString(), queryId: id.toString()}})
    },
    deleteQueryClicked(id: number): void {
      this.deleteId = id
      this.deleteDialog = true
    },
    cancelDeleteQuery(): void {
      this.deleteId = -1
      this.deleteDialog = false
    },
    deleteQuery(): void {
      this.deleteDialog = false

      this.$apollo.mutate({mutation: DELETE_QUERY, variables: {id: this.deleteId}}).then(() => {
        this.$apollo.queries.QUERY.refetch()
      })
    }
  },
  apollo: {
    QUERY: {
      query: GET_QUERY_LIST_BY_DATA_SOURCE_ID,
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
        this.queries = data.QUERY
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