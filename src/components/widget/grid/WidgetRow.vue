<template>
  <div>
    <v-row v-if="!queryData.length" no-gutters :style="cssProps">
      <template v-for="(child, indexChild) in widget.children">
        <BaseWidget
            :key="indexChild"
            :widget="child"
            :theme="theme"
            :datasource="datasource"
            :data-item="dataItem"
            :variables="variables">
        </BaseWidget>
      </template>
    </v-row>

    <v-row v-else>
      <template v-for="(item, indexData) in queryData">
        <template v-for="(child, indexChild) in widget.children">
          <BaseWidget
              :widget="child"
              :theme="theme"
              :datasource="datasource"
              :key="`${indexData}_${indexChild}`"
              :data-item="item">
          </BaseWidget>
        </template>
      </template>
    </v-row>
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import Vue from "vue";
import {AppWidget, Query} from "@/lib/types";
import {getCssProps, getDataProps} from "@/lib/widget";
import {GET_QUERY_BY_ID} from "@/graphql/queries/query";
import * as graphql_gen from "@/lib/graphql_gen";

export default Vue.extend({
  name: 'WidgetRow',
  components: {BaseWidget: () => import("@/components/widget/BaseWidget.vue")},
  props: {
    widget: Object,
    theme: Object,
    datasource: Object,
    dataItem: Object,
    variables: Array
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