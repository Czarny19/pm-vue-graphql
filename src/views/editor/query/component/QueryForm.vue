<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="12" sm="12" md="8" lg="8" xl="8" class="pa-2">
        <v-card color="primary" class="pa-2 pb-6">
          <LoadingCircular v-if="loading"/>

          <template v-else>
            <CardSectionTitle class="mt-4" :title="i18n('editor.query')"/>
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
                :current-table="currentTable"
                :tables-names="tablesNames">
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
                :field-names="currentTableFields">
            </QueryOrderByBuilder>

            <CardSectionTitle
                class="mt-2"
                :title="i18n('editor.variables')"
                show-hide-button
                :is-hidden="propsHidden"
                @showhideclick="propsHidden = !propsHidden">
            </CardSectionTitle>
            <QueryVariables v-if="!propsHidden" :query="query"/>

            <CardSectionTitle
                class="mt-2"
                :title="i18n('editor.restrictions')"
                show-hide-button
                :is-hidden="whereHidden"
                @showhideclick="whereHidden = !whereHidden">
            </CardSectionTitle>
            <QueryWhereBuilder v-if="!whereHidden" :query="query" :fields="currentTable.fields"/>

          </template>
        </v-card>
      </v-col>

      <v-col cols="12" sm="12" md="4" lg="4" xl="4" class="pa-2">
        <QueryPreview :query="query" :datasource-address="datasourceAddress" :datasource-secret="datasourceSecret"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import LoadingCircular from "@/components/loading/LoadingCircular.vue";
import CardSectionTitle from "@/components/card/CardSectionTitle.vue";
import QueryPreview from "@/views/editor/query/component/QueryPreview.vue";
import QueryWhereBuilder from "@/views/editor/query/component/form/QueryWhereBuilder.vue";
import QueryOrderByBuilder from "@/views/editor/query/component/form/QueryOrderByBuilder.vue";
import QueryInfo from "@/views/editor/query/component/form/QueryInfo.vue";
import QueryFields from "@/views/editor/query/component/form/QueryFields.vue";
import QueryVariables from "@/views/editor/query/component/form/QueryVariables.vue";
import {Query, SchemaItem} from "@/lib/types";
import {
  generateGraphQLQuery,
  generateVariablesPreview,
  mapModelStringToQueryOrderByArray,
  mapModelStringToQueryVariableArray,
  mapModelStringToQueryWhereArray
} from "@/lib/query";

export default Vue.extend({
  name: 'QueryForm',
  components: {
    QueryVariables,
    QueryFields,
    QueryInfo,
    QueryOrderByBuilder,
    QueryWhereBuilder,
    QueryPreview,
    CardSectionTitle,
    LoadingCircular
  },
  props: {
    query: Object,
    datasourceAddress: String,
    datasourceSecret: String,
    tables: Array,
    tablesNames: Array,
    loading: Boolean
  },
  data() {
    return {
      valid: false,
      currentQuery: {},
      fieldsHidden: true,
      sortHidden: true,
      propsHidden: true,
      whereHidden: true
    }
  },
  computed: {
    graphQLQuery(): string {
      const query = (this.currentQuery as Query)

      if (!query.name) {
        return ''
      }

      const where = mapModelStringToQueryWhereArray(query.where ?? '')
      const orderBy = mapModelStringToQueryOrderByArray(query.order_by ?? '')
      const vars = mapModelStringToQueryVariableArray(query.variables ?? '')

      return generateGraphQLQuery(
          query.name,
          query.table,
          query.fields,
          where,
          orderBy,
          query.limit,
          vars
      )
    },
    graphQLVariablesPreview(): string {
      const query = (this.currentQuery as Query)
      return generateVariablesPreview(query.variables ?? [])
    },
    currentTable(): SchemaItem {
      return (this.tables as SchemaItem[]).filter(table => table.name === (this.currentQuery as Query).table)[0]
    },
    currentTableFields(): string [] {
      if (!this.currentTable) {
        return []
      }

      return this.currentTable.fields.map((field) => (field as { name: string }).name)
    },
    fieldsVisible(): boolean {
      return (this.currentQuery as Query).table.length > 0
    }
  },
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    }
  },
  watch: {
    query: {
      handler() {
        this.currentQuery = this.query
      },
      deep: true
    }
  },
  beforeMount() {
    this.currentQuery = this.query
  }
})
</script>

<style scoped>

</style>