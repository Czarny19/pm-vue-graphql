<template>
  <v-container fluid class="pa-0">
    <v-card-title class="secondary ml-1 mr-1 mt-1 pt-2 pb-2 elevation-2 rounded">
      {{ i18n('editor.tester') }}
      <IconButton class="ml-8" :label="i18n('editor.runMutation')" color="success" icon="fa-play" @click="run"/>
    </v-card-title>

    <v-row no-gutters>
      <v-col cols="12">
        <v-card-text class="text-start pa-3">
          <div class="text-h6 pb-4">{{ i18n('editor.response') }}</div>

          <div v-if="queryRun && isSuccessful" class="text-body-1">
            <v-icon color="success" class="ml-1 mr-4">fa-check</v-icon>
            {{ i18n('editor.mutationSuccess') }}
          </div>

          <div v-else-if="queryRun" class="text-error text-body-1">{{ mutationError }}</div>
        </v-card-text>
      </v-col>

      <v-col cols="12" xl="6" lg="6" md="12" sm="12">
        <v-card-text class="text-start pa-3">
          <div class="text-h6 pb-4">{{ i18n('editor.mutation') }}</div>

          <div class="accent pa-3">
            <div class="text-black text-body-2" v-html="previewMutation"></div>
          </div>
        </v-card-text>
      </v-col>

      <v-col cols="12" xl="6" lg="6" md="12" sm="12">
        <v-card-text class="text-start pa-3">
          <div class="text-h6 pb-4">{{ i18n('editor.variables') }}</div>

          <div class="accent pa-3">
            <div class="text-black" v-html="graphQLVariablesPreview"></div>
          </div>
        </v-card-text>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import IconButton from "@/components/button/IconButton.vue";
import {Mutation} from "@/lib/types";
import * as graphql_gen from "@/lib/graphql_gen";
import {mutationType} from "@/lib/graphql_gen";

export default Vue.extend({
  name: 'MutationTester',
  components: {IconButton},
  props: {
    mutation: Object,
    datasource: Object
  },
  data() {
    return {
      mutationError: '',
      queryRun: false,
      isSuccessful: true
    }
  },
  computed: {
    graphQLMutation(): string {
      const mutation = (this.mutation as Mutation);

      if (!mutation.name) {
        return '';
      }

      const where = graphql_gen.mapModelStringToQueryWhereArray(mutation.where ?? '');
      const vars = graphql_gen.mapModelStringToQueryVariableArray(mutation.variables ?? '');
      const fields = graphql_gen.mapModelStringToQuerySetValueArray(mutation.fields ?? '');

      return graphql_gen.generateGraphQLMutation(mutation.name, mutation.table, mutation.type as mutationType,
          fields, where, vars);
    },
    previewMutation(): string {
      const mutation = (this.mutation as Mutation);

      if (!mutation.name) {
        return '';
      }

      const where = graphql_gen.mapModelStringToQueryWhereArray(mutation.where ?? '');
      const vars = graphql_gen.mapModelStringToQueryVariableArray(mutation.variables ?? '');
      const fields = graphql_gen.mapModelStringToQuerySetValueArray(mutation.fields ?? '');

      return graphql_gen.generateGraphQLPreviewMutation(mutation.name, mutation.table, mutation.type as mutationType,
          fields, where, vars);
    },
    graphQLVariablesPreview(): string {
      const vars = graphql_gen.mapModelStringToQueryVariableArray(this.mutation.variables ?? '');
      return graphql_gen.generateGraphQLPreviewVariables(vars);
    }
  },
  methods: {
    async run(): Promise<void> {
      const result = await graphql_gen.runMutation(this.datasource.address, this.graphQLMutation,
          this.mutation.table, this.mutation.type as mutationType, this.datasource.secret, this.mutation.variables);

      this.isSuccessful = result.isSuccessful;
      this.queryRun = true;
      (this.mutationError as string | undefined) = result.error;
    }
  }
})
</script>

<style scoped>

</style>