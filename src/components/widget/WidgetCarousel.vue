<template>
  <v-carousel v-model="slide">
    <v-carousel-item  :style="cssProps" v-for="(item, index) in queryData" :key="index">
      <v-sheet :color="argsProps" height="100%" tile>
        <v-row
            class="fill-height"
            align="center"
            justify="center"
        >
          <div class="text-h2">
            Slide {{ i + 1 }}
          </div>
        </v-row>
      </v-sheet>
    </v-carousel-item>
  </v-carousel>
</template>

<script lang="ts">
import Vue from "vue";
import {AppWidget, Query} from "@/lib/types";
import {getArgsProps, getCssProps, getDataProps} from "@/lib/widget";
import * as graphql_gen from "@/lib/graphql_gen";
import {GET_QUERY_BY_ID} from "@/graphql/queries/query";

export default Vue.extend({
  name: 'WidgetCarousel',
  props: {
    widget: Object,
    theme: Object,
    datasource: Object
  },
  data() {
    return {
      slide: 0,
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
    dataProps(): { [k: string]: string } {
      return getDataProps(this.appWidget)
    },
    graphQLQuery(): string {
      const query = (this.query as Query)

      if (!query.name) {
        return ''
      }

      const where = graphql_gen.mapModelStringToQueryWhereArray(query.where ?? '')
      const orderBy = graphql_gen.mapModelStringToQueryOrderByArray(query.order_by ?? '')
      const vars = graphql_gen.mapModelStringToQueryVariableArray(query.variables ?? '')

      return graphql_gen.generateGraphQLQuery(
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
          id: this.dataProps['queryId']
        }
      },
      skip(): boolean {
        return !this.dataProps['queryId'] || !this.datasource
      },
      result({data}): void {
        this.query = data.QUERY[0]

        graphql_gen.runQuery(
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