<template>
  <v-container fluid class="pa-0 pb-3">
    <LoadingDialog :dialog="saving" :title="i18n('datasource.saving')"/>

    <v-row no-gutters>
      <v-col cols="12" sm="12" md="12" lg="6" xl="6" class="pb-3">
        <v-card color="primary" class="pt-2 pb-1 ma-1">
          <LoadingCircular v-if="loading"/>

          <template v-else>
            <CardSectionTitle class="mt-1" :title="i18n('datasource.datasourceConnection')"/>

            <v-form class="pl-2 pr-2 pt-2" v-model="valid" ref="form" @submit.prevent="submit">
              <DatasourceFormConnection :datasource="datasourceTyped"/>
            </v-form>

            <CardSectionTitle :title="i18n('datasource.connectionTest')"/>

            <v-card-text class="pt-4 pl-2 pr-2">
              <GraphQLConnectionTest
                  :address="datasourceTyped.address"
                  :secret="datasourceTyped.secret"
                  :is-auto="false"
                  @setschema="setSchema"
                  @error="clearSchema">
              </GraphQLConnectionTest>
            </v-card-text>

            <v-divider class="ml-4 mr-4"></v-divider>

            <v-card-actions class="ma-2">
              <IconButton :label="i18n('datasource.save')" color="success" icon="fa-save" @click="submit"/>
              <v-spacer></v-spacer>
              <IconButton :label="i18n('common.cancel')" color="error" icon="fa-times" @click="cancel"/>
            </v-card-actions>
          </template>
        </v-card>
      </v-col>

      <v-col cols="12" sm="12" md="12" lg="6" xl="6" class="pb-3">
        <GraphQLSchema class="ma-1" :schema="schema"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import GraphQLConnectionTest from "@/components/graphql/GraphQLConnectionTest.vue";
import DatasourceFormConnection from "@/views/main/datasource/component/DatasourceFormConnection.vue";
import LoadingDialog from "@/components/dialog/LoadingDialog.vue";
import LoadingCircular from "@/components/loading/LoadingCircular.vue";
import CardSectionTitle from "@/components/card/CardSectionTitle.vue";
import IconButton from "@/components/button/IconButton.vue";
import GraphQLSchema from "@/components/graphql/GraphQLSchema.vue";
import {ADD_DATA_SOURCE, UPDATE_DATA_SOURCE} from "@/graphql/queries/datasource";
import {Datasource, SchemaItem} from "@/lib/types";
import {cryptoKey} from "@/main";
import * as CryptoJS from "crypto-js";

export default Vue.extend({
  name: 'DatasourceForm',
  components: {
    LoadingDialog,
    DatasourceFormConnection,
    GraphQLSchema,
    IconButton,
    CardSectionTitle,
    LoadingCircular,
    GraphQLConnectionTest
  },
  props: {
    loading: Boolean,
    datasource: Object,
    userId: Number
  },
  data() {
    return {
      valid: false,
      saving: false,
      datasourceData: {},
      schema: []
    }
  },
  computed: {
    datasourceTyped(): Datasource {
      return (this.datasourceData as Datasource)
    }
  },
  methods: {
    submit(): void {
      (this.$refs.form as Vue & { validate: () => boolean }).validate()

      if (this.valid) {
        this.saving = true
        this.datasourceTyped.id ? this.updateDatasource() : this.createDatasource()
      }
    },
    cancel(): void {
      this.$router.back()
    },
    setSchema(schema: SchemaItem[]): void {
      this.schema = schema as []
    },
    clearSchema(): void {
      this.schema = []
    },
    updateDatasource(): void {
      const encrypted = CryptoJS.AES.encrypt(this.datasourceTyped.secret ?? '', cryptoKey).toString();

      this.$apollo.mutate({
        mutation: UPDATE_DATA_SOURCE,
        variables: {
          id: this.datasourceTyped.id,
          name: this.datasourceTyped.name,
          address: this.datasourceTyped.address,
          secret: encrypted
        }
      }).then(() => {
        this.saving = false
        this.$router.back()
      }).catch(() => {
        this.saving = false
      })
    },
    createDatasource(): void {
      const encrypted = CryptoJS.AES.encrypt(this.datasourceTyped.secret ?? '', cryptoKey).toString();

      this.$apollo.mutate({
        mutation: ADD_DATA_SOURCE,
        variables: {
          userId: this.userId,
          name: this.datasourceTyped.name,
          address: this.datasourceTyped.address,
          secret: encrypted
        }
      }).then(() => {
        this.saving = false
        this.$router.back()
      }).catch(() => {
        this.saving = false
      })
    }
  },
  watch: {
    datasource: {
      handler() {
        this.datasourceData = this.datasource
      },
      deep: true
    }
  }
})
</script>

<style scoped>

</style>