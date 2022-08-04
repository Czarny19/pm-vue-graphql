<template>
  <v-card-text class="pt-4 pb-0">
    <v-select
        class="pl-2 pr-2"
        color="accent"
        item-color="accent"
        v-model="projectData.source_id"
        :items="datasources"
        :label="i18n('project.datasource')"
        required
        append-icon="fa-chevron-down"
        append-outer-icon="fa-times"
        prepend-icon="fa-database"
        item-text="name"
        item-value="id">

      <template v-slot:append-outer>
        <v-icon class="pl-2 pr-2" @click="clearDatasource">fa-times</v-icon>
      </template>
    </v-select>

    <GraphQLConnectionTest
        class="pl-2 pt-3 pb-6"
        v-if="currentDatasource"
        :address="currentDatasource.address"
        :secret="currentDatasource.secret"
        :is-auto="false">
    </GraphQLConnectionTest>
  </v-card-text>
</template>

<script lang="ts">
import Vue from "vue";
import GraphQLConnectionTest from "@/components/graphql/GraphQLConnectionTest.vue";
import {Datasource} from "@/lib/types";

export default Vue.extend({
  name: 'ProjectFormDatasource',
  components: {GraphQLConnectionTest},
  props: {
    project: Object,
    datasources: Array
  },
  data() {
    return {
      projectData: {}
    }
  },
  computed: {
    currentDatasource(): Datasource {
      return (this.datasources as Datasource[]).filter((ds: Datasource) => ds.id === this.projectData.source_id)[0]
    }
  },
  methods: {
    clearDatasource(): void {
      this.$emit('clearsource')
    },
  },
  beforeMount() {
    this.projectData = this.project
  }
})
</script>

<style scoped>

</style>