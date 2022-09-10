<template>
  <div>
    <AppAddQueryDialog
        :dialog="addQueryDialog"
        :datasource-id="datasource.id"
        :tables="tables"
        @refresh="refresh"
        @close="closeAddQuery"
    />

    <DeleteConfirmationDialog :dialog="deleteDialog" @confirm="deleteQuery" @cancel="cancelDeleteQuery"/>

    <v-container fluid class="pa-3">
      <TitleCard :title="i18n('editor.queries')" icon="fa-terminal"/>

      <template v-if="datasourceSet">
        <AddItemCard v-if="!loading" :label="i18n('editor.addQuery')" @add="addQuery"/>
        <LoadingCircular v-if="loading"/>
        <AppMenuQueriesList v-else :datasource-id="datasource.id" :queries="queries" @delete="deleteQueryClicked"/>
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
import AppMenuQueriesList from "@/views/editor/app/component/queries/AppMenuQueriesList.vue";
import AppAddQueryDialog from "@/views/editor/app/component/queries/AppAddQueryDialog.vue";
import AddItemCard from "@/components/card/AddItemCard.vue";
import AppMenuNoDatasource from "@/views/editor/app/component/AppMenuNoDatasource.vue";
import {DELETE_QUERY} from "@/graphql/queries/query";
import {getCleanGraphQLSchema} from "@/lib/schema";
import {SchemaItem} from "@/lib/types";

export default Vue.extend({
  name: 'AppMenuTabQueries',
  components: {
    AppMenuQueriesList,
    AppMenuNoDatasource,
    AddItemCard,
    AppAddQueryDialog,
    LoadingCircular,
    DeleteConfirmationDialog,
    TitleCard
  },
  props: {
    loading: Boolean,
    datasource: Object,
    queries: Array
  },
  data() {
    return {
      addQueryDialog: false,
      deleteDialog: false,
      deleteId: -1,
      schema: []
    }
  },
  computed: {
    datasourceSet(): boolean {
      return Object.keys(this.datasource).length !== 0;
    },
    tables(): string [] {
      return (this.schema as SchemaItem[]).map(table => table.name);
    }
  },
  methods: {
    addQuery(): void {
      this.addQueryDialog = true;
    },
    closeAddQuery(): void {
      this.addQueryDialog = false;
    },
    refresh(): void {
      this.$emit('refresh');
    },
    deleteQueryClicked(id: number): void {
      this.deleteId = id;
      this.deleteDialog = true;
    },
    cancelDeleteQuery(): void {
      this.deleteId = -1;
      this.deleteDialog = false;
    },
    deleteQuery(): void {
      this.deleteDialog = false;

      this.$apollo.mutate({mutation: DELETE_QUERY, variables: {id: this.deleteId}}).then(() => {
        this.$emit('refresh');
      });
    }
  },
  beforeMount() {
    getCleanGraphQLSchema(this.datasource.address, this.datasource.secret).then((result) => {
      (this.schema as SchemaItem[]) = result.schema;
    });
  }
})
</script>

<style scoped>

</style>