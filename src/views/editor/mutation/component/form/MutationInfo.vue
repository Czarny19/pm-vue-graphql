<template>
  <v-card-text class="pa-3 pt-0">
    <div class="elevation-6 pt-6 pl-2 pr-2">
      <v-text-field
          class="pa-2"
          color="accent"
          v-model="currentMutation.name"
          :label="i18n('editor.mutationName')"
          :counter="50"
          :rules="mutationNameRules"
          prepend-icon="fa-tag"
          required>
      </v-text-field>

      <v-select
          class="pa-2"
          color="accent"
          item-color="accent"
          v-model="currentMutation.table"
          :items="tablesNames"
          :label="i18n('editor.tableName')"
          :rules="mutationTableRules"
          required
          append-icon="fa-chevron-down"
          prepend-icon="fa-table"
          item-text="name"
          item-value="id">
      </v-select>

      <v-text-field
          class="pa-2"
          color="accent"
          v-model="typeDisplay"
          :label="i18n('editor.mutationType')"
          prepend-icon="fa-bolt"
          readonly>
      </v-text-field>
    </div>
  </v-card-text>
</template>

<script lang="ts">
import Vue from "vue";
import {Mutation} from "@/lib/types";
import {mutationTypes} from "@/lib/graphql_gen";

export default Vue.extend({
  name: 'MutationInfo',
  props: {
    mutation: Object,
    tablesNames: Array
  },
  data() {
    return {
      currentMutation: {},
      mutationNameRules: [
        (v: string) => !!v || this.$t('editor.mutationNameRequired'),
        (v: string) => (v && v.length <= 50) || this.$t('editor.mutationNameTooLong'),
      ],
      mutationTableRules: [
        (v: string) => !!v || this.$t('editor.tableRequired')
      ],
      mutationTypeRules: [
        (v: string) => !!v || this.$t('editor.mutationTypeRequired')
      ]
    }
  },
  computed: {
    typeDisplay(): string {
      switch ((this.currentMutation as Mutation).type) {
        case mutationTypes.Create:
          return this.$t('editor.mutationInsert').toString()
        case mutationTypes.Update:
          return this.$t('editor.mutationUpdate').toString()
        case mutationTypes.Delete:
          return this.$t('editor.mutationDelete').toString()
        default:
          return (this.currentMutation as Mutation).type
      }
    }
  },
  beforeMount() {
    this.currentMutation = this.mutation
  }
})
</script>

<style scoped>

</style>