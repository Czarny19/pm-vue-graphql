<template>
  <div :style="cssProps" v-if="visible">
    <v-select
        class="pa-0"
        light persistent-hint
        item-color="accent"
        :label="label"
        :color="color"
        :readonly="argsProps.readonly"
        :disabled="argsProps.disabled"
        :hint="hint"
        :dense="argsProps.dense"
        :filled="argsProps.filled"
        :background-color="bgColor"
        :outlined="argsProps.outlined"
        :value="variableValue"
        :rules="rules"
        :items="['', ...queryData]"
        :item-text="dataProps.textQueryFieldName"
        :item-value="dataProps.valueQueryFieldName"
        @change="updateVariableValue"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {AppWidget, PageVariable, Query, QueryOrderBy, QueryVariable, QueryWhere} from "@/lib/types";
import {GET_QUERY_BY_ID} from "@/graphql/queries/query";
import * as graphql_gen from "@/lib/graphql_gen";
import * as widget from "@/lib/widget";

export default Vue.extend({
  name: 'WidgetSelect',
  props: {
    widget: Object,
    datasource: Object,
    theme: Object,
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
    color(): string {
      return widget.getColorPropValue(this.theme, this.argsProps.color);
    },
    bgColor(): string {
      return widget.getColorPropValue(this.theme, this.argsProps.bgColor);
    },
    label(): string {
      return widget.getPageVariableValue(this.variables as PageVariable[], Number(this.argsProps.label));
    },
    hint(): string {
      return widget.getPageVariableValue(this.variables as PageVariable[], Number(this.argsProps.hint));
    },
    variable(): PageVariable | undefined {
      if (this.dataProps.variableId) {
        const variableId = Number(this.dataProps.variableId);
        return (this.variables as PageVariable[])?.find((variable) => variable.id === variableId);
      }

      return undefined;
    },
    variableValue(): string | undefined {
      if (this.variable) {
        return this.variable.value;
      }

      return undefined;
    },
    rules(): unknown[] {
      return widget.getRulesForInput(this.appWidget, undefined);
    },
    graphQlQueryWhere(): QueryWhere[] {
      return graphql_gen.mapModelStringToQueryWhereArray((this.query as Query).where ?? '');
    },
    graphQlQueryOrderBy(): QueryOrderBy[] {
      return graphql_gen.mapModelStringToQueryOrderByArray((this.query as Query).order_by ?? '');
    },
    graphQlQueryVars(): QueryVariable[] {
      const vars = graphql_gen.mapModelStringToQueryVariableArray((this.query as Query).variables ?? '');
      return widget.mapPageVarValuesToQueryVars(this.appWidget, vars, this.variables as PageVariable[]);
    },
    graphQLQuery(): string {
      const query = (this.query as Query);

      if (!query.name) {
        return '';
      }

      return graphql_gen.generateGraphQLQuery(query.name, query.table, query.fields, this.graphQlQueryWhere,
          this.graphQlQueryOrderBy, query.limit, this.graphQlQueryVars);
    },
    data(): never {
      return this.dataItem as never;
    }
  },
  methods: {
    updateVariableValue(val: never): void {
      if (this.variable) {
        this.variable.value = val;
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
    dataItem: {
      handler() {
        const data = this.data;
        const queryFieldName = this.dataProps.initialQueryFieldName;

        const variables = this.variables as PageVariable[];
        const pageVarId = Number(this.dataProps.initialPageVarId);

        const params = this.$route.params;
        const paramName = this.dataProps.initialParamName;

        const intialValue = widget.getWidgetVarValue(data, queryFieldName, variables, pageVarId, params, paramName);

        this.updateVariableValue((isNaN(Number(intialValue)) ? intialValue : Number(intialValue)) as never);
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
  },
  beforeMount() {
    const data = this.data;
    const queryFieldName = this.dataProps.initialQueryFieldName;

    const variables = this.variables as PageVariable[];
    const pageVarId = Number(this.dataProps.initialPageVarId);

    const params = this.$route.params;
    const paramName = this.dataProps.initialParamName;

    const intialValue = widget.getWidgetVarValue(data, queryFieldName, variables, pageVarId, params, paramName);

    this.updateVariableValue((isNaN(Number(intialValue)) ? intialValue : Number(intialValue)) as never);
  }
})
</script>

<style scoped>

</style>