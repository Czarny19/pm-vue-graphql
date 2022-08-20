<template>
  <div>
    <v-select
        class="pt-3 pb-2"
        color="accent"
        outlined dense hide-details
        :label="prop.label"
        :items="queries"
        v-model="currentProp.value"
        item-value="id"
        item-text="name"
        item-color="accent">
    </v-select>

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
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {Query} from "@/lib/types";
import * as graphql_gen from "@/lib/graphql_gen";

export default Vue.extend({
  name: 'GuiEditorPropQuery',
  props: {
    prop: Object,
    queries: Array
  },
  data() {
    return {
      currentProp: {}
    }
  },
  computed: {
    currentQuery(): Query {
      const queryId = (this.currentProp as { value: number }).value
      return (this.queries as Query[]).filter((query) => query.id === queryId)[0]
    },
    variablesPreview(): string {
      if (!this.currentQuery) {
        return ''
      }

      const vars = graphql_gen.mapModelStringToQueryVariableArray(this.currentQuery.variables ?? '')
      return graphql_gen.generateGraphQLPreviewVariables(vars)
    },
    graphQlQueryPreview(): string {
      if (!this.currentQuery) {
        return ''
      }

      const where = graphql_gen.mapModelStringToQueryWhereArray(this.currentQuery.where ?? '')
      const orderBy = graphql_gen.mapModelStringToQueryOrderByArray(this.currentQuery.order_by ?? '')
      const vars = graphql_gen.mapModelStringToQueryVariableArray(this.currentQuery.variables ?? '')

      return graphql_gen.generateGraphQLPreviewQuery(
          this.currentQuery.name,
          this.currentQuery.table,
          this.currentQuery.fields,
          where,
          orderBy,
          this.currentQuery.limit,
          vars
      )
    }
  },
  beforeMount() {
    this.currentProp = this.prop
  }
})
</script>

<style scoped>

</style>