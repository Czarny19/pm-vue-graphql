<template>
  <div>
    <AppAddMutationDialog
        :dialog="addMutationDialog"
        :datasource-id="datasource.id"
        :tables="tables"
        @refresh="refresh"
        @close="closeAddMutation"
    />

    <DeleteConfirmationDialog :dialog="deleteDialog" @confirm="deleteMutation" @cancel="cancelDeleteMutation"/>

    <v-container fluid class="pa-3">
      <TitleCard :title="i18n('editor.mutations')" icon="fa-bolt"/>

      <template v-if="datasourceSet">
        <AddItemCard v-if="!loading" :label="i18n('editor.addMutation')" @add="addMutation"/>
        <LoadingCircular v-if="loading"/>
        <AppMenuMutationsList
            v-else
            :datasource-id="datasource.id"
            :mutations="mutations"
            @delete="deleteMutationClicked"
        />
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
import AppAddMutationDialog from "@/views/editor/app/component/mutations/AppAddMutationDialog.vue";
import AppMenuMutationsList from "@/views/editor/app/component/mutations/AppMenuMutationsList.vue";
import {DELETE_MUTATION} from "@/graphql/queries/mutation";
import {SchemaItem} from "@/lib/types";
import {getCleanGraphQLSchema} from "@/lib/schema";

export default Vue.extend({
  name: 'AppMenuTabMutations',
  components: {
    AppMenuMutationsList,
    AppAddMutationDialog,
    LoadingCircular,
    AddItemCard,
    TitleCard,
    DeleteConfirmationDialog,
    AppMenuNoDatasource
  },
  props: {
    loading: Boolean,
    datasource: Object,
    mutations: Array
  },
  data() {
    return {
      addMutationDialog: false,
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
    addMutation(): void {
      this.addMutationDialog = true;
    },
    closeAddMutation(): void {
      this.addMutationDialog = false;
    },
    refresh(): void {
      this.$emit('refresh');
    },
    deleteMutationClicked(id: number): void {
      this.deleteId = id;
      this.deleteDialog = true;
    },
    cancelDeleteMutation(): void {
      this.deleteId = -1;
      this.deleteDialog = false;
    },
    deleteMutation(): void {
      this.deleteDialog = false;

      this.$apollo.mutate({mutation: DELETE_MUTATION, variables: {id: this.deleteId}}).then(() => {
        this.$emit('refresh');
      });
    }
  },
  beforeMount() {
    getCleanGraphQLSchema(this.datasource.address, this.datasource.secret).then((result) => {
      (this.schema as SchemaItem[]) = result.schema
    });
  }
})
</script>

<style scoped>

</style>