<template>
  <v-data-table :loading="!datasource" :headers="tableHeaders" :items="queryData"/>
</template>

<script lang="ts">
import Vue from "vue";
import {GET_QUERY_BY_ID} from "@/graphql/queries/query";
import {AppWidget, Query} from "@/lib/types";
import {getArgsProps, getCssProps} from "@/lib/widget";
import {generateQuery, runQuery} from "@/lib/query";

export default Vue.extend({
  name: 'WidgetTable',
  props: {
    widget: Object,
    theme: Object,
    datasource: Object,
    datasourceSecret: String
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
      return generateQuery(
          query.name,
          query.table,
          query.fields,
          query.where,
          query.order_by,
          query.limit,
          query.variables
      )
    },
    tableHeaders(): { text: string; value: string }[] {
      const headers: { text: string; value: string }[] = [];

      (this.query as Query).fields?.split(',').forEach((field) => {
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

        console.log(this.datasource)

        runQuery(
            this.datasource.address,
            this.graphQLQuery,
            (this.query as Query).table,
            this.datasourceSecret,
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