<template>
  <div>
    <DeleteConfirmationDialog :dialog="deleteDialog" @confirm="deleteDataSource" @cancel="cancelDeleteDataSource"/>

    <InfoDialog
        :dialog="warningDialog"
        :title="i18n('dashboard.dataSourceDeleteWarning')"
        :msg="i18n('dashboard.dataSourceProjectExists')"
        @close="closeWarningDialog">
    </InfoDialog>

    <v-card class="mb-4" color="primary">
      <TitleCard :title="i18n('dashboard.dataSources')" icon="fa-database"/>
    </v-card>

    <v-card color="primary">
      <LoadingCircular v-if="loading"/>
      <DashboardTabNoData v-else-if="!dataSources.length && !loading" :msg="i18n('dashboard.noDataSources')"/>
    </v-card>

    <v-container v-if="dataSources.length && !loading" fluid class="pa-0">
      <v-row>
        <v-col cols="12" sm="12" md="12" lg="6" xl="6" v-for="(dataSource, index) in dataSources" :key="dataSource.id">
          <v-card color="primary" class="fill-height">
            <v-card-title class="secondary pl-6 pr-6 text-body-1">{{ dataSource.name }}</v-card-title>

            <v-card-text class="text-body-2 text-start pa-2">
              <v-container fluid>
                <v-row class="pa-2">
                  <v-col class="ma-auto" cols="2">
                    <v-icon class="pl-2 pr-2" size="80">fa-database</v-icon>
                  </v-col>

                  <v-col class="ma-auto" cols="9">
                    {{ dataSource.address }}
                    <GraphQLConnectionTest
                        class="pa-0 pt-4"
                        :address="dataSource.address"
                        :secret="decryptSecret(dataSource.secret)"
                        :is-auto="true"
                        @setschema="schema => setSchema(schema, index)"
                        @error="setNotConnected(index)">
                    </GraphQLConnectionTest>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-divider class="ml-4 mr-4"></v-divider>

            <v-card-actions class="ma-2">
              <IconButton
                  :label="i18n('common.modify')"
                  color="info"
                  icon="fa-edit"
                  @click="openModifyDataSource(dataSource.id)">
              </IconButton>
              <v-spacer></v-spacer>
              <IconButton
                  :label="i18n('common.delete')"
                  color="error"
                  icon="fa-trash"
                  @click="deleteDataSourceClicked(dataSource.id)">
              </IconButton>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-card class="pa-4 mt-4 text-end" color="primary">
      <v-btn class="pa-5" min-width="300" color="success" @click="createDataSource">
        {{ i18n('dashboard.addDataSource') }}
        <v-icon small class="pl-6">fa-plus</v-icon>
      </v-btn>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import DeleteConfirmationDialog from "@/components/dialog/DeleteConfirmationDialog.vue";
import TitleCard from "@/components/card/TitleCard.vue";
import LoadingCircular from "@/components/loading/LoadingCircular.vue";
import DashboardTabNoData from "@/views/dashboard/components/tabs/DashboardTabNoData.vue";
import IconButton from "@/components/button/IconButton.vue";
import GraphQLConnectionTest from "@/components/graphql/GraphQLConnectionTest.vue";
import {DELETE_DATA_SOURCE, GET_USER_DATA_SOURCES} from "@/graphql/queries/data_source";
import {CURRENT_USER} from "@/graphql/queries/user";
import {GET_PROJECTS_WITH_DATA_SOURCE} from "@/graphql/queries/project";
import {DataSource, SchemaItem} from "@/plugins/types";
import {cryptoKey} from "@/main";
import * as CryptoJS from "crypto-js";
import InfoDialog from "@/components/dialog/InfoDialog.vue";

export default Vue.extend({
  name: 'DashboardDataSourcesTab',
  components: {
    InfoDialog,
    IconButton,
    DashboardTabNoData,
    LoadingCircular,
    TitleCard,
    GraphQLConnectionTest,
    DeleteConfirmationDialog
  },
  data() {
    return {
      loading: true,
      warningDialog: false,
      deleteDialog: false,
      deleteId: -1,
      currentUser: {id: -1},
      dataSources: []
    }
  },
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    },
    createDataSource(): void {
      this.$router.push({name: 'NewDataSource'})
    },
    openModifyDataSource(id: string): void {
      this.$router.push({name: 'DataSource', params: {dataSourceId: id}})
    },
    deleteDataSourceClicked(id: number): void {
      this.deleteId = id
      this.$apollo.queries.DATA_SOURCE.refresh()
    },
    cancelDeleteDataSource(): void {
      this.deleteId = -1
      this.deleteDialog = false
    },
    deleteDataSource(): void {
      this.deleteDialog = false

      this.$apollo.mutate({
        mutation: DELETE_DATA_SOURCE,
        variables: {
          id: this.deleteId
        }
      }).then(() => {
        this.$apollo.queries.DATA_SOURCE.refetch()
      })
    },
    closeWarningDialog(): void {
      this.warningDialog = false
    },
    decryptSecret(secret: string): string {
      return CryptoJS.AES.decrypt(secret, cryptoKey).toString(CryptoJS.enc.Utf8)
    },
    setSchema(schema: SchemaItem[], index: number): void {
      const datasourcesTmp = this.dataSources as DataSource[];
      this.dataSources = [];

      datasourcesTmp[index].schema = schema;
      datasourcesTmp[index].isConnected = true;

      this.dataSources = datasourcesTmp as [];
    },
    setNotConnected(index: number): void {
      const datasourcesTmp = this.dataSources as DataSource[];
      this.dataSources = [];

      datasourcesTmp[index].isConnected = false;

      this.dataSources = datasourcesTmp as [];
    }
  },
  apollo: {
    currentUser: {
      query: CURRENT_USER
    },
    DATA_SOURCE: {
      query: GET_USER_DATA_SOURCES,
      fetchPolicy: 'network-only',
      variables(): { userId: number } {
        return {
          userId: this.currentUser.id
        }
      },
      skip(): boolean {
        return !this.currentUser
      },
      result({data}): void {
        this.loading = false
        this.dataSources = data.DATA_SOURCE
      }
    },
    PROJECT: {
      query: GET_PROJECTS_WITH_DATA_SOURCE,
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