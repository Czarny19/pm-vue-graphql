<template>
  <div>
    <LoadingDialog :dialog="saving" :title="i18n('editor.savingQuery')"/>

    <RejectChangesDialog :dialog="reject" @cancel="cancelRejectChanges" @confirm="rejectChanges"/>

    <QueryTopBar
        :query="query"
        :reject-visible="changesMade"
        @save="save"
        @reject="setRejectOpen"
        @closeeditor="closeEditor">
    </QueryTopBar>

    <LoadingCircular v-if="loadingQuery || loadingDatasource"/>

    <QueryForm v-else :query="query" :datasource="datasource" :schema="schema"/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import LoadingDialog from "@/components/dialog/LoadingDialog.vue";
import QueryTopBar from "@/views/editor/query/component/QueryTopBar.vue";
import QueryForm from "@/views/editor/query/component/QueryForm.vue";
import RejectChangesDialog from "@/components/dialog/RejectChangesDialog.vue";
import {GET_DATA_SOURCE_BY_ID} from "@/graphql/queries/datasource";
import {GET_QUERY_BY_ID, UPDATE_QUERY} from "@/graphql/queries/query";
import {decodeDatasourceSecret, getCleanGraphQLSchema} from "@/lib/schema";
import {Datasource, Query} from "@/lib/types";
import LoadingCircular from "@/components/loading/LoadingCircular.vue";

export default Vue.extend({
  name: 'QueryPage',
  components: {LoadingCircular, LoadingDialog, RejectChangesDialog, QueryForm, QueryTopBar},
  data() {
    return {
      loadingQuery: true,
      loadingDatasource: true,
      saving: false,
      reject: false,
      changesMade: false,
      queryInitialized: false,
      isClosing: false,
      query: {},
      datasource: {},
      schema: []
    }
  },
  computed: {
    queryId(): number {
      return Number(this.$route.params.queryId)
    },
    datasourceId(): number {
      return Number(this.$route.params.datasourceId)
    },
    datasourceTyped(): Datasource {
      return this.datasource as Datasource
    },
    queryTyped(): Query {
      return this.query as Query
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
    save(): void {
      this.saving = true

      this.$apollo.mutate({
        mutation: UPDATE_QUERY,
        variables: {
          id: this.queryId,
          name: this.queryTyped.name,
          table: this.queryTyped.table,
          limit: this.queryTyped.limit ?? -1,
          fields: this.queryTyped.fields,
          variables: this.queryTyped.variables,
          orderBy: this.queryTyped.order_by,
          where: this.queryTyped.where,
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
      this.loadingQuery = true

      if (this.isClosing) {
        this.$router.back()
        return
      }

      this.$apollo.queries.QUERY.refetch()
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

        if (this.query.limit === -1) {
          this.query.limit = undefined
        }

        this.changesMade = false
        this.loadingQuery = false
      }
    },
    DATA_SOURCE: {
      query: GET_DATA_SOURCE_BY_ID,
      fetchPolicy: 'no-cache',
      variables(): { id: number } {
        return {
          id: this.datasourceId
        }
      },
      skip(): boolean {
        return !this.datasourceId
      },
      async result({data}): Promise<void> {
        this.datasource = data.DATA_SOURCE[0]
        this.datasource.secret = decodeDatasourceSecret(data.DATA_SOURCE[0].secret)

        await getCleanGraphQLSchema(this.datasourceTyped.address, this.datasourceTyped.secret).then((result) => {
          this.schema = result.schema
          this.loadingDatasource = false
        })
      }
    }
  }
})
</script>

<style scoped>

</style>