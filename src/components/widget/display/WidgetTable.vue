<template>
  <v-data-table
      :items-per-page="argsProps.paging ? pageSize : -1"
      hide-default-footer
      :loading="!datasource"
      :headers="tableHeaders"
      :page.sync="page"
      :items="queryData"
      :style="cssProps"
      :dark="argsProps.dark"
      :light="!argsProps.dark">

    <template v-slot:footer>
      <div v-if="argsProps.paging" class="text-center pt-2">
        <v-pagination
            v-model="page"
            :value="1"
            :length="Math.ceil(queryData.length / pageSize)"
            prev-icon="fa-caret-left"
            next-icon="fa-caret-right">
        </v-pagination>
      </div>
    </template>

  </v-data-table>
</template>

<script lang="ts">
import Vue from "vue";
import {GET_QUERY_BY_ID} from "@/graphql/queries/query";
import {AppWidget, PageVariable, Query, QueryOrderBy, QueryVariable, QueryWhere} from "@/lib/types";
import * as graphql_gen from "@/lib/graphql_gen";
import * as widget from "@/lib/widget";

export default Vue.extend({
  name: 'WidgetTable',
  props: {
    widget: Object,
    theme: Object,
    datasource: Object,
    variables: Array
  },
  data() {
    return {
      query: {},
      queryData: [],
      page: 0
    }
  },
  computed: {
    appWidget(): AppWidget {
      return this.widget as AppWidget
    },
    cssProps(): ({ [p: string]: string })[] {
      return widget.getCssProps(this.appWidget, this.theme)
    },
    argsProps(): { [k: string]: string } {
      return widget.getArgsProps(this.appWidget)
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
    tableHeaders(): { text: string; value: string }[] {
      return widget.getQueryPropLabels(this.appWidget)
    },
    pageSize(): number {
      return Number(this.argsProps.pageSize)
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