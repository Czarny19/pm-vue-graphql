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

    <v-container fluid class="pa-4">
      <template v-if="datasourceSet">
        <TitleCard :title="i18n('editor.queries')" icon="fa-terminal"/>

        <v-card class="mt-4" v-if="loading" color="primary">
          <LoadingCircular/>
        </v-card>

        <template v-else>
          <v-card class="mt-4 mb-4 pl-3" color="primary">
            <GraphQLConnectionTest
                :address="datasource.address"
                :secret="secretDecoded"
                :is-auto="true"
                @setschema="setSchema"
                @error="clearSchema">
            </GraphQLConnectionTest>
          </v-card>

          <v-card color="primary" class="mt-3" @click="addQuery">
            <v-container fluid class="pl-6 pr-6 pt-5 pb-5 text-start ma-auto">
              <v-icon class="mr-5">fa-circle-plus</v-icon>
              {{ i18n('editor.addQuery') }}
            </v-container>
          </v-card>

          <v-card color="secondary" v-for="query in queries" :key="query.id" class="mt-3">
            <v-container fluid class="pl-6 pr-6">
              <v-row no-gutters>
                <v-col class="text-start ma-auto">
                  {{ query.name }}
                </v-col>
                <v-col class="text-start ma-auto">
                  {{ i18n('editor.modifyDate') }}: {{ query.modify_date }}
                </v-col>
                <v-col class="text-end">
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
      </template>

      <template v-else>
        <TitleCard :title="i18n('editor.queries')" icon="fa-terminal"/>

        <v-card class="mt-4 mb-4 pa-6" color="primary">
          <v-icon class="pa-6" size="60" color="error">fa-database</v-icon>
          <div class="pa-6 text-h5">{{ i18n('editor.noDatasource') }}</div>
        </v-card>
      </template>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TitleCard from "@/components/card/TitleCard.vue";
import DeleteConfirmationDialog from "@/components/dialog/DeleteConfirmationDialog.vue";
import LoadingCircular from "@/components/loading/LoadingCircular.vue";
import IconButton from "@/components/button/IconButton.vue";
import AppAddQueryDialog from "@/views/editor/app/component/AppAddQueryDialog.vue";
import GraphQLConnectionTest from "@/components/graphql/GraphQLConnectionTest.vue";
import {DELETE_QUERY, GET_DATA_SOURCE_QUERIES} from "@/graphql/queries/query";
import {cryptoKey} from "@/main";
import * as CryptoJS from "crypto-js";
import {SchemaItem} from "@/plugins/types";
import {cleanSchema} from "@/plugins/schema";

export default Vue.extend({
  name: 'AppMenuTabQueries',
  components: {
    GraphQLConnectionTest,
    AppAddQueryDialog,
    IconButton,
    LoadingCircular,
    DeleteConfirmationDialog,
    TitleCard
  },
  props: {datasource: Object},
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
    secretDecoded(): string {
      return CryptoJS.AES.decrypt(this.datasource.secret, cryptoKey).toString(CryptoJS.enc.Utf8)
    },
    tables(): string [] {
      return cleanSchema(this.schema).map(table => table.name)
    }
  },
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    },
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

      this.$apollo.mutate({
        mutation: DELETE_QUERY,
        variables: {
          id: this.deleteId
        }
      }).then(() => {
        this.$apollo.queries.QUERY.refetch()
      })
    },
    setSchema(schema: SchemaItem[]): void {
      this.schema = schema as []
    },
    clearSchema(): void {
      this.schema = []
    }
  },
  apollo: {
    QUERY: {
      query: GET_DATA_SOURCE_QUERIES,
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
  }
})
</script>

<style scoped>

</style>