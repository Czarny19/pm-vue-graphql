<template>
  <v-container fluid class="pa-0">
    <v-row>
      <v-col cols="12" xl="6" lg="6" md="12" sm="12">
        <v-card-text class="text-start pa-4">
          <div class="text-h6 pb-2">
            {{ i18n('editor.query') }}
          </div>

          <div class="accent pa-4">
            <div class="text-black text-body-2" v-html="previewQuery"></div>
          </div>

          <div class="text-h6 pb-2 pt-4">
            {{ i18n('editor.variables') }}
          </div>

          <div class="accent pa-4">
            <div class="text-black" v-html="graphQLVariablesPreview"></div>
          </div>
        </v-card-text>
      </v-col>

      <v-col cols="12" xl="6" lg="6" md="12" sm="12">
        <v-card-text class="text-start pa-4">
          <div class="text-h6 pb-2">
            {{ i18n('editor.data') }}
          </div>

          <v-btn block color="success" @click="run">{{ i18n('editor.runQuery') }}</v-btn>

          <div v-if="isSuccessful" class="accent pa-4 mt-4">
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
import {
  generateGraphQLPreviewQuery,
  generateGraphQLPreviewVariables,
  generateGraphQLQuery,
  mapModelStringToQueryOrderByArray,
  mapModelStringToQueryVariableArray,
  mapModelStringToQueryWhereArray,
  runQuery
} from "@/lib/query";
import {Query} from "@/lib/types";

export default Vue.extend({
  name: 'QueryPreview',
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

      const where = mapModelStringToQueryWhereArray(query.where ?? '')
      const orderBy = mapModelStringToQueryOrderByArray(query.order_by ?? '')
      const vars = mapModelStringToQueryVariableArray(query.variables ?? '')

      return generateGraphQLQuery(
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

      const where = mapModelStringToQueryWhereArray(query.where ?? '')
      const orderBy = mapModelStringToQueryOrderByArray(query.order_by ?? '')
      const vars = mapModelStringToQueryVariableArray(query.variables ?? '')

      return generateGraphQLPreviewQuery(
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
      const vars = mapModelStringToQueryVariableArray(this.query.variables ?? '')
      return generateGraphQLPreviewVariables(vars)
    },
    tableHeaders(): { text: string; value: string }[] {
      const headers: { text: string; value: string }[] = [];

      (this.query.fields as string)?.split(';').forEach((field) => {
        headers.push({text: field, value: field})
      })

      return headers
    }
  },
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    },
    async run(): Promise<void> {
      const result = await runQuery(
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