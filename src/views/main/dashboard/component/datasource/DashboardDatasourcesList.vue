<template>
  <v-container fluid class="pa-0">
    <v-row>
      <v-col cols="12" sm="12" md="12" lg="6" xl="6" v-for="datasource in datasources" :key="datasource.id">
        <v-card color="primary" class="fill-height">
          <v-card-title class="secondary pl-6 pr-6 text-body-2">{{ datasource.name }}</v-card-title>

          <v-card-text class="text-body-2 text-start pa-2">
            <v-container fluid>
              <v-row>
                <v-col class="ma-auto" cols="2">
                  <v-icon class="pl-2 pr-2" size="60">fa-database</v-icon>
                </v-col>

                <v-col class="ma-auto" cols="9">
                  {{ datasource.address }}

                  <GraphQLConnectionTest
                      class="pa-0 pt-4"
                      :address="datasource.address"
                      :secret="datasource.secret"
                      :is-auto="true"
                  />
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
                @click="openModifyDatasource(datasource.id)"
            />

            <v-spacer></v-spacer>

            <IconButton
                :label="i18n('common.delete')"
                color="error"
                icon="fa-trash-can"
                @click="deleteDatasourceClicked(datasource.id)"
            />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import GraphQLConnectionTest from "@/components/graphql/GraphQLConnectionTest.vue";
import IconButton from "@/components/button/IconButton.vue";

export default Vue.extend({
  name: 'DashboardDatasourcesList',
  components: {IconButton, GraphQLConnectionTest},
  props: {
    datasources: Array
  },
  methods: {
    openModifyDatasource(id: string): void {
      this.$router.push({name: 'Datasource', params: {datasourceId: id}});
    },
    deleteDatasourceClicked(id: number): void {
      this.$emit('delete', id);
    }
  }
})
</script>

<style scoped>

</style>