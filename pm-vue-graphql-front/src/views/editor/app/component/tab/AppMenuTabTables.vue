<template>
  <v-container fluid class="pa-4">
    <template v-if="datasourceSet">
      <TitleCard :title="i18n('editor.tables')" icon="fa-table"/>

      <v-card class="mt-4 mb-4 pl-3" color="primary">
        <GraphQLConnectionTest
            :address="datasource.address"
            :secret="secretDecoded"
            :is-auto="true"
            @setschema="setSchema"
            @error="clearSchema">
        </GraphQLConnectionTest>
      </v-card>

      <v-expansion-panels>
        <v-expansion-panel v-for="schemaItem in displaySchema" :key="schemaItem.name">

          <v-expansion-panel-header class="secondary text-start text-body-2" expand-icon="fa-angle-down" ripple>
            {{ schemaItem.name }}
          </v-expansion-panel-header>

          <v-expansion-panel-content class="pt-4">
            <div class="text-start text-body-2 pa-2 pb-4">{{ schemaItem.description }}</div>

            <v-data-table
                :headers="fieldHeaders"
                :items="schemaItem.fields"
                hide-default-footer
                dense
                disable-sort
                class="elevation-0">
            </v-data-table>
          </v-expansion-panel-content>

        </v-expansion-panel>
      </v-expansion-panels>
    </template>

    <template v-else>
      <TitleCard :title="i18n('editor.tables')" icon="fa-table"/>

      <v-card class="mt-4 mb-4 pa-6" color="primary">
        <v-icon class="pa-6" size="60" color="error">fa-database</v-icon>
        <div class="pa-6 text-h5">{{ i18n('editor.noDatasource') }}</div>
      </v-card>
    </template>

  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import TitleCard from "@/components/card/TitleCard.vue";
import GraphQLConnectionTest from "@/components/graphql/GraphQLConnectionTest.vue";
import {cleanSchema} from "@/plugins/schema";
import {cryptoKey} from "@/main";
import {SchemaItem} from "@/plugins/types";
import * as CryptoJS from "crypto-js";

export default Vue.extend({
  name: 'AppMenuTabTables',
  components: {TitleCard, GraphQLConnectionTest},
  props: {datasource: Object},
  data() {
    return {
      schema: []
    }
  },
  computed: {
    datasourceSet(): boolean {
      return Object.keys(this.datasource).length !== 0
    },
    secretDecoded(): string {
      return CryptoJS.AES.decrypt(this.datasource.secret, cryptoKey).toString(CryptoJS.enc.Utf8)
    },
    fieldHeaders(): { text: string; value: string }[] {
      return [
        {text: this.$t('datasource.fieldName').toString(), value: 'name'},
        {text: this.$t('datasource.fieldType').toString(), value: 'type.ofType.name'}
      ]
    },
    displaySchema(): SchemaItem [] {
      return cleanSchema(this.schema)
    }
  },
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    },
    setSchema(schema: SchemaItem[]): void {
      this.schema = schema as []
    },
    clearSchema(): void {
      this.schema = []
    }
  }
})
</script>

<style scoped>

</style>