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

    <v-row v-else v-for="(item, indexData) in queryData" :key="indexData" :style="cssProps">
      <template v-for="(child, indexChild) in widget.children">
        <BaseWidget
            :widget="child"
            :theme="theme"
            :datasource="datasource"
            :key="`${indexData}_${indexChild}`"
            :variables="variables"
            :data-item="item">
        </BaseWidget>
      </template>
    </v-row>
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
      return widget.mapPageVarValuesToQueryVars(this.appWidget, vars, (this.variables as PageVariable[]))
    },
    graphQLQuery(): string {
      const query = (this.query as Query)

      if (!query.name) {
        return ''
      }

      return graphql_gen.generateGraphQLQuery(
          query.name,
          query.table,
          query.fields,
          this.graphQlQueryWhere,
          this.graphQlQueryOrderBy,
          query.limit,
          this.graphQlQueryVars
      )
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

        graphql_gen.runQuery(
            this.datasource.address,
            this.graphQLQuery,
            (this.query as Query).table,
            this.datasource.secret,
            this.graphQlQueryWhere,
            this.graphQlQueryVars
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