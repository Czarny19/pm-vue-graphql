<template>
  <v-container fluid class="pa-0 pb-3">
    <v-row no-gutters>
      <v-col cols="12" class="pa-3 pt-4">
        <v-card color="primary" class="pt-2 pb-3">
          <CardSectionTitle class="mt-1" :title="i18n('editor.query')"/>
          <QueryInfo :query="query" :tables-names="tablesNames"/>

          <CardSectionTitle
              class="mt-2"
              :title="i18n('editor.fields')"
              show-hide-button
              :is-hidden="fieldsHidden"
              @showhideclick="fieldsHidden = !fieldsHidden">
          </CardSectionTitle>
          <QueryFields
              v-if="fieldsVisible && !fieldsHidden"
              :query="query"
              :fields="fields">
          </QueryFields>

          <CardSectionTitle
              class="mt-2"
              :title="i18n('editor.sorting')"
              show-hide-button
              :is-hidden="sortHidden"
              @showhideclick="sortHidden = !sortHidden">
          </CardSectionTitle>
          <QueryOrderByBuilder
              v-if="!sortHidden"
              :query="query"
              :fields="fields">
          </QueryOrderByBuilder>

          <CardSectionTitle
              class="mt-2"
              :title="i18n('editor.variables')"
              show-hide-button
              :is-hidden="variablesHidden"
              @showhideclick="variablesHidden = !variablesHidden">
          </CardSectionTitle>
          <EditorVariables v-if="!variablesHidden" :object="query"/>

          <CardSectionTitle
              class="mt-2"
              :title="i18n('editor.restrictions')"
              show-hide-button
              :is-hidden="whereHidden"
              @showhideclick="whereHidden = !whereHidden">
          </CardSectionTitle>
          <EditorWhereBuilder v-if="!whereHidden" :object="query" :fields="fields"/>
        </v-card>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col class="pa-3 pt-1">
        <v-card color="primary" class="pa-2 pb-6">
          <QueryPreview :query="query" :datasource="datasource"/>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import CardSectionTitle from "@/components/card/CardSectionTitle.vue";
import QueryPreview from "@/views/editor/query/component/QueryPreview.vue";
import QueryOrderByBuilder from "@/views/editor/query/component/form/QueryOrderByBuilder.vue";
import QueryInfo from "@/views/editor/query/component/form/QueryInfo.vue";
import QueryFields from "@/views/editor/query/component/form/QueryFields.vue";
import EditorVariables from "@/components/editor/EditorVariables.vue";
import EditorWhereBuilder from "@/components/editor/EditorWhereBuilder.vue";
import {Query, SchemaItem, SchemaItemField} from "@/lib/types";
import {getAllTableFieldsWithRelations} from "@/lib/schema";

export default Vue.extend({
  name: 'QueryForm',
  components: {
    EditorWhereBuilder,
    EditorVariables,
    QueryFields,
    QueryInfo,
    QueryOrderByBuilder,
    QueryPreview,
    CardSectionTitle
  },
  props: {
    query: Object,
    datasource: Object,
    schema: Array
  },
  data() {
    return {
      currentQuery: {},
      currentSchema: {},
      valid: false,
      fieldsHidden: true,
      sortHidden: true,
      variablesHidden: true,
      whereHidden: true
    }
  },
  computed: {
    fields(): SchemaItemField[] {
      return getAllTableFieldsWithRelations((this.currentQuery as Query).table, this.schema as SchemaItem[])
    },
    fieldsVisible(): boolean {
      return (this.currentQuery as Query).table.length > 0
    },
    tablesNames(): string [] {
      return (this.schema as { name: string }[])?.map((table) => table.name)
    }
  },
  watch: {
    query: {
      handler() {
        this.currentQuery = this.query
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
    this.currentQuery = this.query
    this.currentSchema = this.schema
  }
})
</script>

<style scoped>

</style>