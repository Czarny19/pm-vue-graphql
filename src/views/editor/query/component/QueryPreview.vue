<template>
  <v-container fluid class="pa-0">
    <v-card-title class="secondary ml-1 mr-1 mt-1 pt-2 pb-2 elevation-2 rounded">
      {{ i18n('editor.query') }}
      <IconButton class="ml-8" :label="i18n('editor.runQuery')" color="success" icon="fa-play" @click="run"/>
    </v-card-title>

    <v-row>
      <v-col cols="12" xl="6" lg="6" md="12" sm="12">
        <v-card-text class="text-start pa-3">
          <div class="text-h6 pb-4">{{ i18n('editor.query') }}</div>

          <div class="accent pa-3">
            <div class="text-black text-body-2" v-html="previewQuery"></div>
          </div>

          <div class="text-h6 pb-4 pt-6">{{ i18n('editor.variables') }}</div>

          <div class="accent pa-3">
            <div class="text-black" v-html="graphQLVariablesPreview"></div>
          </div>
        </v-card-text>
      </v-col>

      <v-col cols="12" xl="6" lg="6" md="12" sm="12">
        <v-card-text class="text-start pa-3">
          <div class="text-h6 pb-4">{{ i18n('editor.response') }}</div>

          <div v-if="isSuccessful" class="accent pa-3">
            <pre class="text-black">{{ JSON.stringify(queryData, null, 2) }}</pre>
          </div>

          <div v-else class="text-error text-body-1">{{ queryError }}</div>
        </v-card-text>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import IconButton from "@/components/button/IconButton.vue";
import {Query} from "@/lib/types";
import * as graphql_gen from "@/lib/graphql_gen";

export default Vue.extend({
  name: 'QueryPreview',
  components: {IconButton},
  props: {
    query: Object,
    datasource: Object
  },
  data() {
    return {
      queryData: [],
      queryError: '',
      isSuccessful: true
    }
  },
  computed: {
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
    previewQuery(): string {
      const query = (this.query as Query)

      if (!query.name) {
        return ''
      }

      const where = graphql_gen.mapModelStringToQueryWhereArray(query.where ?? '')
      const orderBy = graphql_gen.mapModelStringToQueryOrderByArray(query.order_by ?? '')
      const vars = graphql_gen.mapModelStringToQueryVariableArray(query.variables ?? '')

      return graphql_gen.generateGraphQLPreviewQuery(
          query.name,
          query.table,
          query.fields,
          where,
          orderBy,
          query.limit,
          vars
      )
    },
    graphQLVariablesPreview(): string {
      const vars = graphql_gen.mapModelStringToQueryVariableArray(this.query.variables ?? '')
      return graphql_gen.generateGraphQLPreviewVariables(vars)
    }
  },
  methods: {
    async run(): Promise<void> {
      const result = await graphql_gen.runQuery(
          this.datasource.address,
          this.graphQLQuery,
          this.query.table,
          this.datasource.secret,
          this.query.variables
      )

      this.isSuccessful = result.isSuccessful;
      (this.queryData as unknown[]) = result.data;
      (this.queryError as string | undefined) = result.error;
    }
  }
})
</script>

<style scoped>

</style>