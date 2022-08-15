<template>
  <v-container fluid class="pa-0 pb-3">
    <v-row no-gutters>
      <v-col cols="12" class="pa-3 pt-4">
        <v-card color="primary" class="pt-2 pb-3">
          <CardSectionTitle class="mt-1" :title="i18n('editor.mutation')"/>
          <MutationInfo :mutation="mutation" :tables-names="tablesNames"/>

          <CardSectionTitle
              class="mt-2"
              :title="i18n('editor.variables')"
              show-hide-button
              :is-hidden="variablesHidden"
              @showhideclick="variablesHidden = !variablesHidden">
          </CardSectionTitle>
          <EditorVariables v-if="!variablesHidden" :object="mutation"/>

          <CardSectionTitle
              v-if="!isCreate"
              class="mt-2"
              :title="i18n('editor.restrictions')"
              show-hide-button
              :is-hidden="whereHidden"
              @showhideclick="whereHidden = !whereHidden">
          </CardSectionTitle>
          <EditorWhereBuilder v-if="!whereHidden && !isCreate" :object="mutation" :fields="fields"/>

          <CardSectionTitle
              v-if="!isDelete"
              class="mt-2"
              :title="i18n('editor.fields')"
              show-hide-button
              :is-hidden="setHidden"
              @showhideclick="setHidden = !setHidden">
          </CardSectionTitle>
          <MutationFieldsCreate v-if="!setHidden && isCreate" :mutation="mutation" :fields="fields"/>
          <MutationFieldsUpdate v-if="!setHidden && isUpdate" :mutation="mutation" :fields="fields"/>
        </v-card>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col class="pa-3 pt-1">
        <v-card color="primary" class="pa-2 pb-6">
          <MutationTester :mutation="mutation" :datasource="datasource"/>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import CardSectionTitle from "@/components/card/CardSectionTitle.vue";
import MutationInfo from "@/views/editor/mutation/component/form/MutationInfo.vue";
import EditorVariables from "@/components/editor/EditorVariables.vue";
import EditorWhereBuilder from "@/components/editor/EditorWhereBuilder.vue";
import MutationFieldsCreate from "@/views/editor/mutation/component/form/MutationFieldsCreate.vue";
import MutationTester from "@/views/editor/mutation/component/MutationTester.vue";
import MutationFieldsUpdate from "@/views/editor/mutation/component/form/MutationFieldsUpdate.vue";
import {Mutation, Query, SchemaItem, SchemaItemField} from "@/lib/types";
import {mutationType} from "@/lib/graphql_gen";
import {getAllTableFieldsWithRelations} from "@/lib/schema";

export default Vue.extend({
  name: 'MutationForm',
  components: {
    MutationFieldsUpdate,
    MutationTester,
    MutationFieldsCreate,
    EditorWhereBuilder,
    EditorVariables,
    MutationInfo,
    CardSectionTitle
  },
  props: {
    mutation: Object,
    datasource: Object,
    schema: Array
  },
  data() {
    return {
      currentMutation: {},
      currentSchema: {},
      valid: false,
      setHidden: true,
      variablesHidden: true,
      whereHidden: true
    }
  },
  computed: {
    isCreate(): boolean {
      return (this.currentMutation as Mutation).type === mutationType.Create
    },
    isUpdate(): boolean {
      return (this.currentMutation as Mutation).type === mutationType.Update
    },
    isDelete(): boolean {
      return (this.currentMutation as Mutation).type === mutationType.Delete
    },
    fields(): SchemaItemField[] {
      return getAllTableFieldsWithRelations((this.mutation as Mutation).table, this.schema as SchemaItem[])
    },
    fieldsVisible(): boolean {
      return (this.currentMutation as Query).table.length > 0
    },
    tablesNames(): string [] {
      return (this.schema as { name: string }[])?.map((table) => table.name)
    }
  },
  watch: {
    query: {
      handler() {
        this.currentMutation = this.mutation
      },
      deep: true
    },
    schema: {
      handler() {
        this.currentSchema = this.schema
      },
      deep: true
    }
  },
  beforeMount() {
    this.currentMutation = this.mutation
    this.currentSchema = this.schema
  }
})
</script>

<style scoped>

</style>