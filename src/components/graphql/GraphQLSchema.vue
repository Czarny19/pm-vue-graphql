<template>
  <v-card v-if="!schema.length" color="primary" class="pt-2 pb-2">
    <CardSectionTitle class="mt-1" :title="i18n('datasource.schema')"/>
    <v-card-text class="text-body-2 pt-4">{{ i18n('datasource.noSchema') }}</v-card-text>
  </v-card>

  <v-card v-else color="primary" class="pt-2">
    <CardSectionTitle class="mt-1" :title="i18n('datasource.schema')"/>
    <GraphQLTables class="pa-3" :schema="schema"/>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import CardSectionTitle from "@/components/card/CardSectionTitle.vue";
import GraphQLTables from "@/components/graphql/GraphQLTables.vue";

export default Vue.extend({
  name: 'GraphQLSchema',
  components: {GraphQLTables, CardSectionTitle},
  props: {
    schema: Array,
  }
})
</script>

<style scoped>

</style>