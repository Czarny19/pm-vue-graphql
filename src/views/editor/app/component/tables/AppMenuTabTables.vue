<template>
  <v-container fluid class="pa-3">
    <TitleCard :title="i18n('editor.tables')" icon="fa-table"/>

    <GraphQLTables v-if="datasourceSet" class="mt-3" :schema="schema"/>
    <AppMenuNoDatasource v-else/>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import TitleCard from "@/components/card/TitleCard.vue";
import GraphQLTables from "@/components/graphql/GraphQLTables.vue";
import AppMenuNoDatasource from "@/views/editor/app/component/AppMenuNoDatasource.vue";
import {getCleanGraphQLSchema} from "@/lib/schema";
import {SchemaItem} from "@/lib/types";

export default Vue.extend({
  name: 'AppMenuTabTables',
  components: {AppMenuNoDatasource, GraphQLTables, TitleCard},
  props: {
    datasource: Object
  },
  data() {
    return {
      schema: []
    }
  },
  computed: {
    datasourceSet(): boolean {
      return Object.keys(this.datasource).length !== 0;
    }
  },
  beforeMount() {
    getCleanGraphQLSchema(this.datasource.address, this.datasource.secret).then((result) => {
      (this.schema as SchemaItem[]) = result.schema;
    });
  }
})
</script>

<style scoped>

</style>