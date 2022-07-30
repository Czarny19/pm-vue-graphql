<template>
  <v-container>
    <v-row class="text-start">
      <v-col class="text-body-1 ma-auto">
        <v-icon :color="connectionStatusColor" class="pr-4">fa-circle</v-icon>
        {{ i18n('datasource.connectionStatus') }}: {{ connectionStatusDesc }}
      </v-col>
      <v-col v-if="!isAuto" class="text-end pr-2">
        <v-btn class="pa-6" color="info" @click="checkConnection" :disabled="!address">
          {{ i18n('datasource.checkConnection') }}
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-if="errorMsg" no-gutters class="text-start ml-0 pl-0">
      <div class="text-body-2 mt-2 mb-2 pl-4 pr-4 pb-2 pt-2 error-chip">{{ errorMsg }}</div>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import ApolloClient from "apollo-client";
import {HttpLink} from "apollo-link-http";
import {InMemoryCache} from "apollo-cache-inmemory";
import {GET_SCHEMA} from "@/graphql/queries/schema";
import {typeDefs} from "@/graphql/typedefs";

export default Vue.extend({
  name: 'GraphQLConnectionTest',
  props: {
    address: String,
    secret: String,
    isAuto: Boolean
  },
  data() {
    return {
      connectionStatusDesc: '',
      connectionStatusColor: '',
      errorMsg: '',
      schema: null
    }
  },
  computed: {
    headers(): { 'authorization': string, 'content-type': string, 'x-hasura-admin-secret': string } {
      const headers = {'authorization': '', 'content-type': '', 'x-hasura-admin-secret': ''}
      const token = window.localStorage.getItem('apollo-token')
      if (token) headers.authorization = `Bearer ${token}`
      headers['content-type'] = 'application/json'
      headers['x-hasura-admin-secret'] = this.secret
      return headers
    }
  },
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    },
    async checkConnection(): Promise<void> {
      const linkOptions = {uri: this.address, headers: this.headers}

      const client = new ApolloClient({
        typeDefs: typeDefs,
        link: new HttpLink(linkOptions),
        cache: new InMemoryCache({addTypename: true}),
        resolvers: {}
      })

      await client.query({query: GET_SCHEMA, fetchPolicy: 'network-only'}).then(response => {
        this.schema = response.data.__schema.types
        this.connectionStatusColor = 'success'
        this.connectionStatusDesc = this.$t('datasource.statusSuccess').toString()
        this.errorMsg = ''

        this.$emit('setschema', this.schema)
      }).catch(err => {
        this.schema = null
        this.connectionStatusColor = 'error'
        this.connectionStatusDesc = this.$t('datasource.statusError').toString()
        this.errorMsg = err

        this.$emit('error')
      })
    }
  },
  async beforeMount() {
    this.connectionStatusDesc = this.$t('datasource.statusNone').toString()
    this.connectionStatusColor = 'grey'

    if (this.isAuto) {
      await this.checkConnection();
    }
  }
})
</script>

<style scoped>

</style>