<template>
  <v-card class="pt-6" color="primary">
    <CardSectionTitle :title="i18n('editor.preview')"/>

    <v-card-text class="text-start pa-4">
      <div class="text-h6 pb-2">
        {{ i18n('editor.query') }}
      </div>

      <div class="accent pa-4">
        <div class="text-black" v-html="displayQuery"></div>
      </div>

      <div class="text-h6 pb-2 pt-4">
        {{ i18n('editor.variables') }}
      </div>

      <div class="accent pa-4">
        <div class="text-black" v-html="displayVariables"></div>
      </div>

      <v-btn block color="success" class="mt-6" @click="runQuery">{{ i18n('editor.runQuery') }}</v-btn>

      <div class="text-h6 pb-2 pt-4">
        {{ i18n('editor.data') }}
      </div>

      <v-data-table
          v-if="isSuccessful"
          hide-default-footer
          :headers="tableHeaders"
          :items="queryData">
      </v-data-table>

      <div v-else class="text-error text-body-1">{{ queryError }}</div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import ApolloClient from "apollo-client";
import {typeDefs} from "@/graphql/typedefs";
import {HttpLink} from "apollo-link-http";
import {InMemoryCache} from "apollo-cache-inmemory";
import gql from "graphql-tag";
import CardSectionTitle from "@/components/card/CardSectionTitle.vue";
import {generateVariablesPreview} from "@/plugins/query";
import {QueryVariable} from "@/plugins/types";

export default Vue.extend({
  name: 'QueryPreview',
  components: {CardSectionTitle},
  props: {
    table: String,
    fields: String,
    graphqlQuery: String,
    graphqlVariables: Array,
    datasourceAddress: String,
    datasourceSecret: String
  },
  data() {
    return {
      queryData: [],
      queryError: '',
      isSuccessful: true
    }
  },
  computed: {
    displayQuery(): string {
      return this.graphqlQuery?.replaceAll('\n', '<br>').replaceAll('\t', '&emsp;')
    },
    graphQLVariablesPreview(): string {
      return generateVariablesPreview((this.graphqlVariables as QueryVariable[]) ?? [])
    },
    displayVariables(): string {
      return this.graphQLVariablesPreview
          ?.replaceAll('\n', '<br>')
          .replaceAll('\t', '&emsp;')
    },
    headers(): { 'authorization': string, 'content-type': string, 'x-hasura-admin-secret': string } {
      const headers = {'authorization': '', 'content-type': '', 'x-hasura-admin-secret': ''}
      const token = window.localStorage.getItem('apollo-token')
      if (token) headers.authorization = `Bearer ${token}`
      headers['content-type'] = 'application/json'
      headers['x-hasura-admin-secret'] = this.datasourceSecret
      return headers
    },
    tableHeaders(): { text: string; value: string }[] {
      const headers: { text: string; value: string }[] = []

      this.fields?.split(',').forEach((field) => {
        headers.push({text: field, value: field})
      })

      return headers
    }
  },
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    },
    async runQuery(): Promise<void> {
      this.isSuccessful = true

      const linkOptions = {uri: this.datasourceAddress, headers: this.headers}

      const client = new ApolloClient({
        typeDefs: typeDefs,
        link: new HttpLink(linkOptions),
        cache: new InMemoryCache({addTypename: true}),
        resolvers: {}
      })

      const variables = (this.graphqlVariables as QueryVariable[])
      const variablesMap: { [key: string]: string } = {}

      variables.forEach((variable) => variablesMap[variable.name] = variable.value)

      try {
        await client.query({
          query: gql`${this.graphqlQuery}`,
          variables: variablesMap,
          fetchPolicy: 'network-only'
        }).then(response => {
          this.queryData = response.data[this.table]
        }).catch(err => {
          this.isSuccessful = false
          this.queryError = err
        })
      } catch (e) {
        this.isSuccessful = false

        if (typeof e === "string") {
          this.queryError = e
        } else if (e instanceof Error) {
          this.queryError = e.message
        }
      }
    }
  }
})
</script>

<style scoped>

</style>