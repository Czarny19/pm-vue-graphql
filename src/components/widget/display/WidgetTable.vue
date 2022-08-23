<template>
  <v-data-table
      :items-per-page="paging ? pageSize : -1"
      hide-default-footer
      :loading="!datasource"
      :headers="tableHeaders"
      :page.sync="page"
      :items="queryData"
      :style="cssProps"
      :dark="dark"
      :light="!dark">

    <template v-slot:footer>
      <div v-if="paging" class="text-center pt-2">
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
import {AppWidget, Query, TableHeader} from "@/lib/types";
import {getArgsProps, getCssProps, getDataProps} from "@/lib/widget";
import * as graphql_gen from "@/lib/graphql_gen";

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
      queryData: [],
      page: 0
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
      const dataPropGroups = this.appWidget.propGroups.filter((group: { type: string }) => group.type === 'data')[0]
      const props = (dataPropGroups as { props: { id: string, labels: TableHeader[] }[] }).props
      const labels = props.filter((prop) => prop.id === 'queryId')[0].labels

      return labels.filter(label => label.visible).sort((a, b) => Number(a.order) - Number(b.order))
    },
    dark(): boolean {
      return Boolean(this.argsProps.dark)
    },
    paging(): boolean {
      return Boolean(this.argsProps.paging)
    },
    pageSize(): number {
      return Number(this.argsProps.pageSize)
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