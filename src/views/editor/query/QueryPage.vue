<template>
  <div>
    <LoadingDialog :dialog="saving" :title="i18n('editor.saving')"/>

    <RejectChangesDialog :dialog="reject" @cancel="cancelRejectChanges" @confirm="rejectChanges"/>

    <QueryTopBar
        :query="query"
        :reject-visible="changesMade"
        @save="save"
        @reject="setRejectOpen"
        @closeeditor="closeEditor">
    </QueryTopBar>

    <QueryForm
        :query="query"
        :datasource="datasource"
        :tables="tables"
        :loading="loading || loadingDatasource">
    </QueryForm>

    <GraphQLConnectionTest
        class="d-none"
        v-if="!loadingDatasource"
        :address="datasource.address"
        :secret="datasource.secret"
        :is-auto="true"
        @setschema="setSchema"
        @error="clearSchema">
    </GraphQLConnectionTest>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import LoadingDialog from "@/components/dialog/LoadingDialog.vue";
import QueryTopBar from "@/views/editor/query/component/QueryTopBar.vue";
import QueryForm from "@/views/editor/query/component/QueryForm.vue";
import GraphQLConnectionTest from "@/components/graphql/GraphQLConnectionTest.vue";
import RejectChangesDialog from "@/components/dialog/RejectChangesDialog.vue";
import {GET_DATA_SOURCE_BY_ID} from "@/graphql/queries/data_source";
import {GET_QUERY_BY_ID, UPDATE_QUERY_BY_ID} from "@/graphql/queries/query";
import {cleanSchema} from "@/lib/schema";
import {Query, SchemaItem} from "@/lib/types";
import {cryptoKey} from "@/main";
import * as CryptoJS from "crypto-js";

export default Vue.extend({
  name: 'QueryPage',
  components: {LoadingDialog, RejectChangesDialog, GraphQLConnectionTest, QueryForm, QueryTopBar},
  data() {
    return {
      loading: true,
      loadingDatasource: true,
      saving: false,
      reject: false,
      changesMade: false,
      queryInitialized: false,
      isClosing: false,
      queryId: -1,
      query: {},
      datasourceId: -1,
      datasource: {},
      schema: []
    }
  },
  computed: {
    tables(): { name: string } [] {
      return cleanSchema(this.schema)
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
    save(): void {
      this.saving = true

      this.$apollo.mutate({
        mutation: UPDATE_QUERY_BY_ID,
        variables: {
          id: this.queryId,
          name: (this.query as Query).name,
          table: (this.query as Query).table,
          limit: (this.query as Query).limit,
          fields: (this.query as Query).fields,
          variables: (this.query as Query).variables,
          orderBy: (this.query as Query).order_by,
          where: (this.query as Query).where,
          modifyDate: new Date()
        }
      }).then(() => {
        this.changesMade = false
        this.saving = false
      })
    },
    closeEditor(): void {
      if (this.changesMade) {
        this.isClosing = true
        this.setRejectOpen()
        return
      }

      this.$router.back()
    },
    setRejectOpen(): void {
      this.reject = true
    },
    cancelRejectChanges(): void {
      this.isClosing = false
      this.reject = false
    },
    rejectChanges(): void {
      this.reject = false
      this.queryInitialized = false
      this.changesMade = false;
      this.loading = true

      if (this.isClosing) {
        this.$router.back()
        return
      }

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
      fetchPolicy: 'no-cache',
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
        this.changesMade = false
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
        this.datasource.secret = CryptoJS.AES.decrypt(data.DATA_SOURCE[0].secret, cryptoKey).toString(CryptoJS.enc.Utf8)
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