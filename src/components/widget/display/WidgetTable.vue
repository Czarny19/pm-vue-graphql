<template>
  <v-data-table
      class="pointer"
      v-if="visible"
      :items-per-page="argsProps.paging ? pageSize : -1"
      hide-default-footer
      :loading="!datasource"
      :headers="tableHeaders"
      :page.sync="page"
      :items="queryData"
      :style="cssProps"
      :dark="argsProps.dark"
      :light="!argsProps.dark"
      @click:row="clickRowAction"
  >
    <template v-slot:footer>
      <div v-if="argsProps.paging" class="text-center pt-2">
        <v-pagination
            class="pt-4 pb-4"
            :style="{'background-color': 'grey'}"
            v-model="page"
            :value="page"
            :length="Math.ceil(itemCount / pageSize)"
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
import {ActionProp, AppWidget, PageVariable, Query, QueryOrderBy, QueryVariable, QueryWhere} from "@/lib/types";
import * as graphql_gen from "@/lib/graphql_gen";
import * as widget from "@/lib/widget";

export default Vue.extend({
  name: 'WidgetTable',
  props: {
    widget: Object,
    theme: Object,
    dataItem: Object,
    datasource: Object,
    variables: Array
  },
  data() {
    return {
      query: {},
      queryData: [],
      page: 1,
      itemCount: 0
    }
  },
  computed: {
    appWidget(): AppWidget {
      return this.widget as AppWidget;
    },
    visible(): boolean {
      return widget.isWidgetVisible(this.appWidget, this.dataItem);
    },
    cssProps(): ({ [p: string]: string })[] {
      return widget.getCssProps(this.appWidget, this.theme);
    },
    argsProps(): { [k: string]: string } {
      return widget.getArgsProps(this.appWidget);
    },
    dataProps(): { [k: string]: string } {
      return widget.getDataProps(this.appWidget);
    },
    graphQlQueryWhere(): QueryWhere[] {
      return graphql_gen.mapModelStringToQueryWhereArray((this.query as Query).where ?? '');
    },
    graphQlQueryOrderBy(): QueryOrderBy[] {
      return graphql_gen.mapModelStringToQueryOrderByArray((this.query as Query).order_by ?? '');
    },
    graphQlQueryVars(): QueryVariable[] {
      const queryVars = graphql_gen.mapModelStringToQueryVariableArray((this.query as Query).variables ?? '');
      return widget.mapPageVarValuesToQueryVars(this.appWidget, queryVars, this.variables as PageVariable[]);
    },
    graphQLQuery(): string {
      const query = (this.query as Query);

      if (!query.name) {
        return '';
      }

      return graphql_gen.generateGraphQLQuery(query.name, query.table, query.fields, this.graphQlQueryWhere,
          this.graphQlQueryOrderBy, query.limit, this.graphQlQueryVars, this.page - 1, this.pageSize);
    },
    tableHeaders(): { text: string; value: string }[] {
      return widget.getQueryPropLabels(this.appWidget);
    },
    pageSize(): number {
      return Number(this.argsProps.pageSize);
    }
  },
  methods: {
    clickRowAction(data: never, item: { index: number }): void {
      if (!this.$route.path.startsWith('/admin')) {
        const projectId = this.$route.params.projectId;
        const variables = this.variables as PageVariable[];
        const params = this.$route.params;

        const actions = this.appWidget.propGroups.find((group: { type: string }) => group.type === 'action');
        const action = actions?.props[0] as unknown as ActionProp;

        widget.runWidgetClickAction(action, projectId, this.datasource, this.queryData[item.index], variables, params);
      }
    }
  },
  watch: {
    variables: {
      handler() {
        this.$apollo.queries.QUERY.refetch();
      },
      deep: true
    },
    query: {
      async handler() {
        const query = (this.query as Query);

        if (query.name) {
          this.itemCount =
              await graphql_gen.getTableItemsCount(this.datasource.address, query.table, this.datasource.secret);
        }
      },
      deep: true
    },
    page() {
      this.$apollo.queries.QUERY.refetch();
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
        return !this.dataProps.queryId || !this.datasource;
      },
      result({data}): void {
        this.query = data.QUERY[0];

        graphql_gen.runQuery(this.datasource.address, this.graphQLQuery, (this.query as Query).table,
            this.datasource.secret, this.graphQlQueryWhere, this.graphQlQueryVars).then((result) => {
          (this.queryData as unknown[]) = result.data;
        });
      }
    }
  }
})
</script>

<style scoped>

</style>