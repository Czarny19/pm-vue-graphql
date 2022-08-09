<template>
  <div>
    <DeleteConfirmationDialog :dialog="deleteDialog" @confirm="deleteDatasource" @cancel="cancelDeleteDatasource"/>

    <InfoDialog
        :dialog="warningDialog"
        :title="i18n('dashboard.datasourceDeleteWarning')"
        :msg="i18n('dashboard.datasourceProjectExists')"
        @close="closeWarningDialog">
    </InfoDialog>

    <TitleCard :title="i18n('dashboard.datasources')" icon="fa-database"/>
    <AddItemCard :label="i18n('dashboard.addDatasource')" @add="createDatasource"/>

    <LoadingCircular v-if="loading"/>
    <DashboardTabNoData v-else-if="!datasources.length && !loading" :msg="i18n('dashboard.noDatasources')"/>

    <DashboardDatasourcesList
        v-if="datasources.length && !loading"
        :datasources="datasources"
        @delete="deleteDatasourceClicked">
    </DashboardDatasourcesList>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import DashboardDatasourcesList from "@/views/main/dashboard/component/datasource/DashboardDatasourcesList.vue";
import DeleteConfirmationDialog from "@/components/dialog/DeleteConfirmationDialog.vue";
import TitleCard from "@/components/card/TitleCard.vue";
import LoadingCircular from "@/components/loading/LoadingCircular.vue";
import DashboardTabNoData from "@/views/main/dashboard/component/tab/DashboardTabNoData.vue";
import InfoDialog from "@/components/dialog/InfoDialog.vue";
import AddItemCard from "@/components/card/AddItemCard.vue";
import {DELETE_DATA_SOURCE} from "@/graphql/queries/datasource";
import {GET_PROJECT_LIST_BY_DATA_SOURCE_ID} from "@/graphql/queries/project";

export default Vue.extend({
  name: 'DashboardDatasourcesTab',
  components: {
    DashboardDatasourcesList,
    AddItemCard,
    InfoDialog,
    DashboardTabNoData,
    LoadingCircular,
    TitleCard,
    DeleteConfirmationDialog
  },
  props: {
    loading: Boolean,
    datasources: Array
  },
  data() {
    return {
      warningDialog: false,
      deleteDialog: false,
      deleteId: -1
    }
  },
  methods: {
    createDatasource(): void {
      this.$router.push({name: 'NewDatasource'})
    },
    deleteDatasourceClicked(id: number): void {
      this.deleteId = id
      this.$apollo.queries.DATA_SOURCE.refresh()
    },
    cancelDeleteDatasource(): void {
      this.deleteId = -1
      this.deleteDialog = false
    },
    deleteDatasource(): void {
      this.deleteDialog = false

      this.$apollo.mutate({mutation: DELETE_DATA_SOURCE, variables: {id: this.deleteId}}).then(() => {
        this.$apollo.queries.DATA_SOURCE.refetch()
      })
    },
    closeWarningDialog(): void {
      this.warningDialog = false
    }
  },
  apollo: {
    PROJECT: {
      query: GET_PROJECT_LIST_BY_DATA_SOURCE_ID,
      fetchPolicy: 'network-only',
      variables(): { id: number } {
        return {
          id: this.deleteId
        }
      },
      skip(): boolean {
        return this.deleteId < 0
      },
      result({data}): void {
        if (data.PROJECT.length) {
          this.warningDialog = true
          this.deleteId = -1
          return
        }

        this.deleteDialog = true
      }
    }
  }
})
</script>

<style scoped>

</style>