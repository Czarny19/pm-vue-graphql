<template>
  <div>
    <template v-for="(rowItem, rowIndex) in dataItems">
      <v-row :key="rowIndex" :style="cssProps" v-if="visible(rowItem)">
        <template v-for="(child, childIndex) in widget.children">
          <BaseWidget
              v-for="(columnItem, colIndex) in columnDataItems(rowItem, columnRelationshipName(child))"
              :key="`${rowIndex}_${childIndex}_${colIndex}`"
              :widget="child"
              :theme="theme"
              :datasource="datasource"
              :variables="variables"
              :data-item="columnItem"
              :mutations="mutations"
              @showerror="showError"
              @saving="saving"
              @savingdone="savingDone">
          </BaseWidget>
        </template>
      </v-row>
    </template>
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import Vue from "vue";
import {AppWidget, PageVariable, Query, QueryOrderBy, QueryVariable, QueryWhere} from "@/lib/types";
import {GET_QUERY_BY_ID} from "@/graphql/queries/query";
import * as graphql_gen from "@/lib/graphql_gen";
import * as widget from "@/lib/widget";

export default Vue.extend({
  name: 'WidgetRow',
  components: {BaseWidget: () => import("@/components/widget/BaseWidget.vue")},
  props: {
    widget: Object,
    theme: Object,
    datasource: Object,
    dataItem: Object,
    variables: Array,
    mutations: Array
  },
  data() {
    return {
      query: {},
      queryData: []
    }
  },
  computed: {
    appWidget(): AppWidget {
      return this.widget as AppWidget
    },
    cssProps(): ({ [p: string]: string })[] {
      return widget.getCssProps(this.appWidget, this.theme)
    },
    dataProps(): { [k: string]: string } {
      return widget.getDataProps(this.appWidget)
    },
    graphQlQueryWhere(): QueryWhere[] {
      return graphql_gen.mapModelStringToQueryWhereArray((this.query as Query).where ?? '')
    },
    graphQlQueryOrderBy(): QueryOrderBy[] {
      return graphql_gen.mapModelStringToQueryOrderByArray((this.query as Query).order_by ?? '')
    },
    graphQlQueryVars(): QueryVariable[] {
      const vars = graphql_gen.mapModelStringToQueryVariableArray((this.query as Query).variables ?? '')
      return widget.mapPageVarValuesToQueryVars(this.appWidget, vars, this.variables as PageVariable[])
    },
    graphQLQuery(): string {
      const query = (this.query as Query)

      if (!query.name) {
        return ''
      }

      return graphql_gen.generateGraphQLQuery(query.name, query.table, query.fields, this.graphQlQueryWhere,
          this.graphQlQueryOrderBy, query.limit, this.graphQlQueryVars)
    },
    dataItems(): never[] {
      if (this.queryData.length) {
        return this.queryData
      }

      if (this.dataItem) {
        return [this.dataItem as never]
      }

      return [{} as never]
    }
  },
  methods: {
    visible(dataItem: never): boolean {
      return widget.isWidgetVisible(this.appWidget, dataItem)
    },
    columnRelationshipName(colWidget: AppWidget): string {
      return widget.getDataProps(colWidget).relationship
    },
    columnDataItems(rowDataItem: never, relationshipName: string): never[] {
      if (rowDataItem && relationshipName) {
        return rowDataItem[relationshipName]
      }

      if (rowDataItem) {
        return [rowDataItem]
      }

      if (this.dataItem) {
        return [this.dataItem as never]
      }

      return [{} as never]
    },
    showError(error: string) {
      this.$emit('showerror', error)
    },
    saving(): void {
      this.$emit('saving')
    },
    savingDone(): void {
      this.$emit('savingdone')
    }
  },
  watch: {
    variables: {
      handler() {
        this.$apollo.queries.QUERY.refetch()
      },
      deep: true
    }
  },
  apollo: {
    QUERY: {
      query: GET_QUERY_BY_ID,
      fetchPolicy: 'no-cache',
      variables(): { id: number } {
        return {
          id: this.dataProps.queryId
        }
      },
      skip(): boolean {
        return !this.dataProps.queryId || !this.datasource
      },
      result({data}): void {
        this.query = data.QUERY[0]

        graphql_gen.runQuery(this.datasource.address, this.graphQLQuery, (this.query as Query).table,
            this.datasource.secret, this.graphQlQueryWhere, this.graphQlQueryVars).then((result) => {
          (this.queryData as unknown[]) = result.data;
        })
      }
    }
  }
})
</script>

<style scoped>

</style>