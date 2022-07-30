<template>
  <v-card class="pt-6" color="primary">
    <CardSectionTitle :title="i18n('editor.preview')"/>

    <v-card-text class="text-start pa-4">
      <div class="text-h6 pb-2">
        {{ i18n('editor.query') }}
      </div>

      <div class="accent pa-4">
        <div class="text-black" v-html="displayQuery"></div>
      </div>

      <div class="text-h6 pb-2 pt-4">
        {{ i18n('editor.variables') }}
      </div>

      <div class="accent pa-4">
        <div class="text-black" v-html="displayVariables"></div>
      </div>

      <v-btn block color="success" class="mt-6" @click="run">{{ i18n('editor.runQuery') }}</v-btn>

      <div class="text-h6 pb-2 pt-4">
        {{ i18n('editor.data') }}
      </div>

      <v-data-table
          v-if="isSuccessful"
          hide-default-footer
          :headers="tableHeaders"
          :items="queryData">
      </v-data-table>

      <div v-else class="text-error text-body-1">{{ queryError }}</div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import CardSectionTitle from "@/components/card/CardSectionTitle.vue";
import {generateVariablesPreview, runQuery} from "@/lib/query";

export default Vue.extend({
  name: 'QueryPreview',
  components: {CardSectionTitle},
  props: {
    query: Object,
    datasourceAddress: String,
    datasourceSecret: String
  },
  data() {
    return {
      queryData: [],
      queryError: '',
      isSuccessful: true
    }
  },
  computed: {
    displayQuery(): string {
      return this.graphqlQuery?.replaceAll('\n', '<br>').replaceAll('\t', '&emsp;')
    },
    graphQLVariablesPreview(): string {
      return generateVariablesPreview((this.graphqlVariables as string) ?? '')
    },
    displayVariables(): string {
      return this.graphQLVariablesPreview
          ?.replaceAll('\n', '<br>')
          .replaceAll('\t', '&emsp;')
    },
    tableHeaders(): { text: string; value: string }[] {
      const headers: { text: string; value: string }[] = []

      this.fields?.split(',').forEach((field) => {
        headers.push({text: field, value: field})
      })

      return headers
    }
  },
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    },
    async run(): Promise<void> {
      const result = await runQuery(
          this.datasourceAddress,
          this.graphqlQuery,
          this.table,
          this.datasourceSecret,
          this.graphqlVariables
      )

      this.isSuccessful = result.isSuccessful;
      (this.queryData as unknown[]) = result.data;
      (this.queryError as string | undefined) = result.error;
    }
  }
})
</script>

<style scoped>

</style>