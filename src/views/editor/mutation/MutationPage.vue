<template>
  <div>
    <LoadingDialog :dialog="saving" :title="i18n('editor.savingMutation')"/>

    <RejectChangesDialog :dialog="reject" @cancel="cancelRejectChanges" @confirm="rejectChanges"/>

    <MutationTopBar
        :mutation="mutation"
        :reject-visible="changesMade"
        @save="save"
        @reject="setRejectOpen"
        @closeeditor="closeEditor">
    </MutationTopBar>

    <LoadingCircular v-if="loadingMutation || loadingDatasource"/>

    <MutationForm v-else :mutation="mutation" :datasource="datasource" :schema="schema"/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import LoadingDialog from "@/components/dialog/LoadingDialog.vue";
import RejectChangesDialog from "@/components/dialog/RejectChangesDialog.vue";
import LoadingCircular from "@/components/loading/LoadingCircular.vue";
import MutationTopBar from "@/views/editor/mutation/component/MutationTopBar.vue";
import MutationForm from "@/views/editor/mutation/component/MutationForm.vue";
import {Datasource, Mutation} from "@/lib/types";
import {GET_DATA_SOURCE_BY_ID} from "@/graphql/queries/datasource";
import {GET_MUTATION_BY_ID, UPDATE_MUTATION} from "@/graphql/queries/mutation";
import {decodeDatasourceSecret, getCleanGraphQLSchema} from "@/lib/schema";

export default Vue.extend({
  name: 'MutationPage',
  components: {MutationForm, MutationTopBar, LoadingCircular, RejectChangesDialog, LoadingDialog},
  data() {
    return {
      loadingMutation: true,
      loadingDatasource: true,
      saving: false,
      reject: false,
      changesMade: false,
      mutationInitialized: false,
      isClosing: false,
      mutation: {},
      datasource: {},
      schema: []
    }
  },
  computed: {
    mutationId(): number {
      return Number(this.$route.params.mutationId)
    },
    datasourceId(): number {
      return Number(this.$route.params.datasourceId)
    },
    datasourceTyped(): Datasource {
      return this.datasource as Datasource
    },
    mutationTyped(): Mutation {
      return this.mutation as Mutation
    }
  },
  watch: {
    mutation: {
      handler() {
        if (!this.mutationInitialized) {
          this.mutationInitialized = true
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
        mutation: UPDATE_MUTATION,
        variables: {
          id: this.mutationId,
          name: this.mutationTyped.name,
          table: this.mutationTyped.table,
          fields: this.mutationTyped.fields,
          where: this.mutationTyped.where,
          variables: this.mutationTyped.variables,
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
      this.mutationInitialized = false
      this.changesMade = false;
      this.loadingMutation = true

      if (this.isClosing) {
        this.$router.back()
        return
      }

      this.$apollo.queries.MUTATION.refetch()
    }
  },
  apollo: {
    MUTATION: {
      query: GET_MUTATION_BY_ID,
      fetchPolicy: 'no-cache',
      variables(): { id: number } {
        return {
          id: this.mutationId
        }
      },
      skip(): boolean {
        return !this.mutationId
      },
      result({data}): void {
        this.mutation = data.MUTATION[0]
        this.changesMade = false
        this.loadingMutation = false
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