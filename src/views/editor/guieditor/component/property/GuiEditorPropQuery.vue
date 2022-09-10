<template>
  <div>
    <v-select
        class="pt-3 pb-2"
        color="accent"
        outlined dense hide-details
        :label="prop.label"
        :items="['', ...queries]"
        v-model="currentProp.value"
        item-value="id"
        item-text="name"
        item-color="accent"
    />

    <div class="text-end">
      <v-tooltip top color="accent" class="pa-4" min-width="600">
        <template v-slot:activator="{ on, attrs }">
          <v-btn small class="pa-4 mr-2" color="secondary" v-bind="attrs" v-on="on">
            <v-icon small>fa-terminal</v-icon>
          </v-btn>
        </template>

        <div class="text-start accent">
          <div class="text-black" v-html="graphQlQueryPreview"></div>
        </div>
      </v-tooltip>

      <v-tooltip top color="accent" class="pa-4" min-width="600">
        <template v-slot:activator="{ on, attrs }">
          <v-btn small class="pa-4" color="secondary" v-bind="attrs" v-on="on">
            <v-icon small>fa-list-ol</v-icon>
          </v-btn>
        </template>

        <div class="text-start accent">
          <div class="text-black" v-html="variablesPreview"></div>
        </div>
      </v-tooltip>
    </div>

    <div v-if="prop.variablesMapping && prop.variablesMapping.length">
      {{ i18n('editor.props') }}

      <div v-for="(varMapping, index) in prop.variablesMapping" :key="index" class="pt-2">
        <v-select
            class="pa-0"
            color="accent"
            outlined dense hide-details
            :label="varMapping.qrVar"
            :items="['', ...variables]"
            v-model="varMapping.pageVar"
            item-value="id"
            item-text="name"
            item-color="accent"
        />
      </div>
    </div>

    <div v-if="prop.customLabels">
      {{ i18n('editor.labels') }}

      <div v-for="(label, index) in prop.labels" :key="index" class="pt-2">
        <span class="text-body-2">{{ label.value }}</span>

        <v-row>
          <v-col cols="12">
            <v-text-field
                class="pt-3"
                color="accent"
                outlined dense hide-details
                :label="label.value"
                v-model="label.text"
            />
          </v-col>

          <v-col cols="auto" class="pa-0 pl-3 pb-3">
            <v-text-field
                class="pt-0"
                color="accent"
                outlined dense hide-details
                v-model="label.order"
                @keydown="filterNumbersOnly"
            />
          </v-col>

          <v-spacer></v-spacer>

          <v-col cols="auto" class="pl-3 pr-4 pb-1 pt-1 text-end">
            <v-btn
                fab
                x-small
                color="primary"
                hide-details
                v-model="label.visible"
                @click="label.visible = !label.visible"
            >
              <v-icon v-if="label.visible">fa-check</v-icon>
              <v-icon v-else>fa-times</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-divider class="mt-3" v-if="index + 1 < prop.labels.length"></v-divider>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {Query, QueryPagePropMapping, TableHeader} from "@/lib/types";
import {filterNumbersOnly} from "@/lib/filters";
import * as graphql_gen from "@/lib/graphql_gen";

export default Vue.extend({
  name: 'GuiEditorPropQuery',
  props: {
    prop: Object,
    queries: Array,
    variables: Array
  },
  data() {
    return {
      currentProp: {},
      queryId: -1,
      propInitialized: false
    }
  },
  computed: {
    currentQuery(): Query {
      const queryId = (this.currentProp as { value: number }).value;
      return (this.queries as Query[]).filter((query) => query.id === queryId)[0];
    },
    variablesPreview(): string {
      if (!this.currentQuery) {
        return '';
      }

      const vars = graphql_gen.mapModelStringToQueryVariableArray(this.currentQuery.variables ?? '');
      return graphql_gen.generateGraphQLPreviewVariables(vars);
    },
    graphQlQueryPreview(): string {
      if (!this.currentQuery) {
        return '';
      }

      const where = graphql_gen.mapModelStringToQueryWhereArray(this.currentQuery.where ?? '');
      const orderBy = graphql_gen.mapModelStringToQueryOrderByArray(this.currentQuery.order_by ?? '');
      const vars = graphql_gen.mapModelStringToQueryVariableArray(this.currentQuery.variables ?? '');

      return graphql_gen.generateGraphQLPreviewQuery(this.currentQuery.name, this.currentQuery.table,
          this.currentQuery.fields, where, orderBy, this.currentQuery.limit, vars);
    }
  },
  methods: {
    filterNumbersOnly(event: KeyboardEvent) {
      filterNumbersOnly(event);
    }
  },
  watch: {
    currentProp: {
      handler() {
        const prop = this.currentProp as { labels: string[], value: number };

        if (!this.propInitialized) {
          this.propInitialized = true;
          return;
        }

        if (this.queryId !== prop.value) {
          this.queryId = prop.value;

          if (this.currentQuery) {
            (this.currentProp as { labels: string[] }).labels = [];
            (this.currentProp as { variablesMapping: QueryPagePropMapping[] }).variablesMapping = [];

            this.currentQuery.fields.split(';').forEach((variable, index) => {
              (this.currentProp as { labels: TableHeader[] }).labels.push({
                text: variable,
                value: variable,
                order: index + 1,
                visible: true
              });
            });

            const vars = graphql_gen.mapModelStringToQueryVariableArray(this.currentQuery.variables ?? '');

            vars.forEach((variable) => {
              (this.currentProp as { variablesMapping: QueryPagePropMapping[] }).variablesMapping.push({
                qrVar: variable.name,
                type: variable.type,
                pageVar: undefined
              });
            });
          }
        }
      },
      deep: true
    }
  },
  beforeMount() {
    this.currentProp = this.prop;
    this.queryId = this.prop.value;
  }
})
</script>

<style scoped>

</style>