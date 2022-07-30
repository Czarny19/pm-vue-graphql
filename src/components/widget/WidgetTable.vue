<template>
  <v-data-table :loading="!datasource" :headers="tableHeaders" :items="queryData"/>
</template>

<script lang="ts">
import Vue from "vue";
import {GET_QUERY_BY_ID} from "@/graphql/queries/query";
import {AppWidget, Query} from "@/lib/types";
import {getArgsProps, getCssProps} from "@/lib/widget";
import {
  generateGraphQLQuery,
  mapModelStringToQueryOrderByArray, mapModelStringToQueryVariableArray,
  mapModelStringToQueryWhereArray,
  runQuery
} from "@/lib/query";

export default Vue.extend({
  name: 'WidgetTable',
  props: {
    widget: Object,
    theme: Object,
    datasource: Object
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
      return getCssProps(this.appWidget, this.theme)
    },
    argsProps(): { [k: string]: string } {
      return getArgsProps(this.appWidget)
    },
    graphQLQuery(): string {
      const query = (this.query as Query)

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
    tableHeaders(): { text: string; value: string }[] {
      const headers: { text: string; value: string }[] = [];

      (this.query as Query).fields?.split(';').forEach((field) => {
        headers.push({text: field, value: field})
      })

      return headers
    }
  },
  apollo: {
    QUERY: {
      query: GET_QUERY_BY_ID,
      fetchPolicy: 'no-cache',
      variables(): { id: number } {
        return {
          id: this.argsProps['queryId']
        }
      },
      skip(): boolean {
        return !this.argsProps['queryId'] || !this.datasource
      },
      result({data}): void {
        this.query = data.QUERY[0]

        runQuery(
            this.datasource.address,
            this.graphQLQuery,
            (this.query as Query).table,
            this.datasource.secret,
            (this.query as Query).variables
        ).then((result) => {
          (this.queryData as unknown[]) = result.data;
        })
      }
    }
  }
})
</script>

<style scoped>

</style>