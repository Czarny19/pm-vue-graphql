<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="12" sm="12" md="7" lg="6" xl="6" class="pa-2">
        <v-card color="primary" class="pa-2">
          <LoadingCircular v-if="loading"/>

          <template v-else>
            <CardSectionTitle class="mt-4" :title="i18n('datasource.datasourceConnection')"/>

            <v-form v-model="valid" ref="form" @submit.prevent="submit">
              <v-card-text class="pt-4">
                <v-text-field
                    class="pa-4"
                    color="accent"
                    v-model="datasourceName"
                    :label="i18n('datasource.name')"
                    :counter="30"
                    :rules="nameRules"
                    prepend-icon="fa-tag"
                    required>
                </v-text-field>

                <v-textarea
                    class="pa-4"
                    color="accent"
                    v-model="address"
                    :label="i18n('datasource.address')"
                    :rules="addressRules"
                    :counter="200"
                    prepend-icon="fa-globe"
                    required
                    auto-grow
                    rows="1">
                </v-textarea>

                <v-text-field
                    class="pa-4"
                    color="accent"
                    v-model="secret"
                    :label="i18n('datasource.secret')"
                    prepend-icon="fa-key"
                    type="password"
                    required
                    auto-grow
                    rows="1">
                </v-text-field>
              </v-card-text>
            </v-form>

            <CardSectionTitle :title="i18n('datasource.connectionTest')"/>

            <v-card-text class="pt-4 pl-2 pr-2">
              <GraphQLConnectionTest
                  :address="address"
                  :secret="secret"
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

      <v-col cols="12" sm="12" md="5" lg="3" xl="3" class="pa-2">
        <GraphQLSchema :schema="schema"/>
      </v-col>

      <v-col cols="12" sm="12" md="12" lg="3" xl="3" class="pa-2">
        <DataSourceInfo/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import GraphQLConnectionTest from "@/components/graphql/GraphQLConnectionTest.vue";
import LoadingCircular from "@/components/loading/LoadingCircular.vue";
import CardSectionTitle from "@/components/card/CardSectionTitle.vue";
import IconButton from "@/components/button/IconButton.vue";
import {ADD_DATA_SOURCE_FOR_USER, GET_DATA_SOURCE_BY_ID, UPDATE_DATA_SOURCE_BY_ID} from "@/graphql/queries/data_source";
import {CURRENT_USER} from "@/graphql/queries/user";
import {cryptoKey} from "@/main";
import {SchemaItem} from "@/plugins/types";
import * as CryptoJS from "crypto-js";
import DataSourceInfo from "@/views/datasource/component/DataSourceInfo.vue";
import GraphQLSchema from "@/components/graphql/GraphQLSchema.vue";

export default Vue.extend({
  name: 'DataSourceForm',
  components: {GraphQLSchema, DataSourceInfo, IconButton, CardSectionTitle, LoadingCircular, GraphQLConnectionTest},
  props: {
    dataSourceId: Number,
  },
  data() {
    return {
      loading: true,
      currentUser: {id: -1},
      datasourceName: '',
      address: '',
      secret: '',
      valid: false,
      schema: [],
      nameRules: [
        (v: string) => !!v || this.$t('datasource.nameRequired'),
        (v: string) => (v && v.length <= 30) || this.$t('datasource.nameTooLong'),
      ],
      addressRules: [
        (v: string) => !!v || this.$t('datasource.addressRequired')
      ]
    }
  },
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    },
    submit(): void {
      (this.$refs.form as Vue & { validate: () => boolean }).validate()

      if (this.valid) {
        this.$emit('saving', true)
        this.dataSourceId ? this.updateDataSource() : this.createDataSource()
      }
    },
    cancel(): void {
      this.$router.back()
    },
    setSchema(schema: SchemaItem[]): void {
      this.schema = schema as []
      this.$emit('setschema', this.schema)
    },
    clearSchema(): void {
      this.schema = []
      this.$emit('setschema', this.schema)
    },
    updateDataSource(): void {
      const encrypted = CryptoJS.AES.encrypt(this.secret, cryptoKey).toString();

      this.$apollo.mutate({
        mutation: UPDATE_DATA_SOURCE_BY_ID,
        variables: {
          id: this.dataSourceId,
          name: this.datasourceName,
          address: this.address,
          secret: encrypted
        }
      }).then(() => {
        this.$emit('saving', false)
        this.$router.back()
      }).catch(() => {
        this.$emit('saving', false)
      })
    },
    createDataSource(): void {
      const encrypted = CryptoJS.AES.encrypt(this.secret, cryptoKey).toString();

      this.$apollo.mutate({
        mutation: ADD_DATA_SOURCE_FOR_USER,
        variables: {
          userId: this.currentUser.id,
          name: this.datasourceName,
          address: this.address,
          secret: encrypted
        }
      }).then(() => {
        this.$emit('saving', false)
        this.$router.back()
      }).catch(() => {
        this.$emit('saving', false)
      })
    }
  },
  apollo: {
    currentUser: {
      query: CURRENT_USER
    },
    DATA_SOURCE: {
      query: GET_DATA_SOURCE_BY_ID,
      fetchPolicy: 'network-only',
      variables(): { id: number } {
        return {
          id: this.dataSourceId
        }
      },
      skip(): boolean {
        return !this.dataSourceId
      },
      result({data}): void {
        this.datasourceName = data.DATA_SOURCE[0].name
        this.address = data.DATA_SOURCE[0].address
        this.secret = CryptoJS.AES.decrypt(data.DATA_SOURCE[0].secret, cryptoKey).toString(CryptoJS.enc.Utf8)
        this.loading = false
      }
    }
  },
  beforeMount() {
    if (!this.dataSourceId) {
      this.loading = false
    }
  }
})
</script>

<style scoped>

</style>