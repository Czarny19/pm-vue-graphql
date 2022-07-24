<template>
  <div>
    <DeleteConfirmationDialog :dialog="deleteDialog" @confirm="deleteQuery" @cancel="cancelDeleteQuery"/>

    <v-container fluid class="pa-4">
      <TitleCard :title="i18n('editor.queries')" icon="fa-terminal"/>

      <v-card class="mt-4" v-if="loading" color="primary">
        <LoadingCircular/>
      </v-card>

      <template v-else>
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
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TitleCard from "@/components/card/TitleCard.vue";
import DeleteConfirmationDialog from "@/components/dialog/DeleteConfirmationDialog.vue";
import LoadingCircular from "@/components/loading/LoadingCircular.vue";
import IconButton from "@/components/button/IconButton.vue";
import {DELETE_QUERY, GET_DATA_SOURCE_QUERIES} from "@/graphql/queries/query";

export default Vue.extend({
  name: 'AppMenuTabQueries',
  components: {IconButton, LoadingCircular, DeleteConfirmationDialog, TitleCard},
  props: {
    datasourceId: Number
  },
  data() {
    return {
      loading: true,
      queries: [],
      deleteDialog: false,
      deleteId: -1,
    }
  },
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    },
    addQuery(): void {
      this.$router.push({name: 'NewQuery'})
    },
    openQuery(id: number): void {
      this.$router.push({name: 'Query', params: {queryId: id.toString()}})
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
    }
  },
  apollo: {
    QUERY: {
      query: GET_DATA_SOURCE_QUERIES,
      fetchPolicy: 'network-only',
      variables(): { datasourceId: number } {
        return {
          datasourceId: this.datasourceId
        }
      },
      skip(): boolean {
        return !this.datasourceId
      },
      result({data}): void {
        this.queries = data.QUERY
        this.loading = false
      }
    }
  },
})
</script>

<style scoped>

</style>