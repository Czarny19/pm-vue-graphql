<template>
  <div>
    <QueryTopBar :query="query" :reject-visible="changesMade"/>

    <QueryForm
        :query="query"
        :datasource-address="datasource.address"
        :datasource-secret="secretDecoded"
        :tables-names="tablesNames"
        :tables="tables"
        :loading="loading || loadingDatasource">
    </QueryForm>

    <GraphQLConnectionTest
        class="d-none"
        v-if="!loadingDatasource"
        :address="datasource.address"
        :secret="secretDecoded"
        :is-auto="true"
        @setschema="setSchema"
        @error="clearSchema">
    </GraphQLConnectionTest>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {GET_QUERY_BY_ID} from "@/graphql/queries/query";
import QueryTopBar from "@/views/editor/query/component/QueryTopBar.vue";
import QueryForm from "@/views/editor/query/component/QueryForm.vue";
import {GET_DATA_SOURCE_BY_ID} from "@/graphql/queries/data_source";
import * as CryptoJS from "crypto-js";
import {cryptoKey} from "@/main";
import GraphQLConnectionTest from "@/components/graphql/GraphQLConnectionTest.vue";
import {cleanSchema} from "@/plugins/schema";
import {SchemaItem} from "@/plugins/types";

export default Vue.extend({
  name: 'QueryPage',
  components: {GraphQLConnectionTest, QueryForm, QueryTopBar},
  data() {
    return {
      loading: true,
      loadingDatasource: true,
      saving: false,
      reject: false,
      changesMade: false,
      queryInitialized: false,
      queryId: -1,
      query: {},
      datasourceId: -1,
      datasource: {secret: ''},
      datasourceSecret: '',
      schema: []
    }
  },
  computed: {
    secretDecoded(): string {
      return CryptoJS.AES.decrypt(this.datasource.secret, cryptoKey).toString(CryptoJS.enc.Utf8)
    },
    tables(): { name: string } [] {
      return cleanSchema(this.schema)
    },
    tablesNames(): string [] {
      return this.tables.map(table => table.name)
    }
  },
  watch: {
    query: {
      handler() {
        if (!this.queryInitialized) {
          this.queryInitialized = true
          return
        }

        this.changesMade = true
      },
      deep: true
    }
  },
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    },
    // save(): void {
    //   this.saving = true
    //
    //   this.$apollo.mutate({
    //     mutation: UPDATE_PAGE_DEFINITION_BY_ID,
    //     variables: {
    //       id: this.pageId,
    //       definition: (this.page as { definition: string }).definition
    // }
    // }).then(() => {
    //     this.changesMade = false
    //     this.saving = false
    //   })
    // },
    setRejectOpen(): void {
      this.reject = true
    },
    cancelRejectChanges(): void {
      this.reject = false
    },
    rejectChanges(): void {
      this.reject = false
      this.queryInitialized = false
      this.changesMade = false
      this.loading = true

      this.$apollo.queries.QUERY.refetch()
    },
    setSchema(schema: SchemaItem[]): void {
      this.schema = schema as []
    },
    clearSchema(): void {
      this.schema = []
    }
  },
  apollo: {
    QUERY: {
      query: GET_QUERY_BY_ID,
      fetchPolicy: 'network-only',
      variables(): { id: number } {
        return {
          id: this.queryId
        }
      },
      skip(): boolean {
        return !this.queryId
      },
      result({data}): void {
        this.query = data.QUERY[0]
        this.loading = false
      }
    },
    DATA_SOURCE: {
      query: GET_DATA_SOURCE_BY_ID,
      fetchPolicy: 'network-only',
      variables(): { id: number } {
        return {
          id: this.datasourceId
        }
      },
      skip(): boolean {
        return !this.datasourceId
      },
      result({data}): void {
        this.datasource = data.DATA_SOURCE[0]
        this.datasourceSecret = CryptoJS.AES.decrypt(data.DATA_SOURCE[0].secret, cryptoKey).toString(CryptoJS.enc.Utf8)
        this.loadingDatasource = false
      }
    }
  },
  beforeMount() {
    this.queryId = Number(this.$route.params.queryId)
    this.datasourceId = Number(this.$route.params.datasourceId)
  }
})
</script>

<style scoped>

</style>