<template>
  <v-card-text class="pa-3 pt-0">
    <div class="elevation-6 pt-6 pl-2 pr-2">
      <v-text-field
          class="pa-2"
          color="accent"
          v-model="currentQuery.name"
          :label="i18n('editor.queryName')"
          :counter="50"
          :rules="queryNameRules"
          prepend-icon="fa-tag"
          required
      />

      <v-select
          class="pa-2"
          color="accent"
          item-color="accent"
          v-model="currentQuery.table"
          :items="['', ...tablesNames]"
          :label="i18n('editor.tableName')"
          :rules="queryTableRules"
          required
          append-icon="fa-chevron-down"
          prepend-icon="fa-table"
          item-text="name"
          item-value="id"
      />

      <v-text-field
          class="pa-2"
          color="accent"
          v-model="currentQuery.limit"
          :label="i18n('editor.limit')"
          :rules="limitRules"
          prepend-icon="fa-list-ol"
          @keydown="filterNumbersOnly"
      />
    </div>
  </v-card-text>
</template>

<script lang="ts">
import Vue from "vue";
import {Query} from "@/lib/types";
import {filterNumbersOnly} from "@/lib/filters";

export default Vue.extend({
  name: 'QueryInfo',
  props: {
    query: Object,
    tablesNames: Array
  },
  data() {
    return {
      currentQuery: {},
      queryNameRules: [
        (v: string) => !!v || this.$t('editor.queryNameRequired'),
        (v: string) => (v && v.length <= 50) || this.$t('editor.queryNameTooLong'),
      ],
      queryTableRules: [
        (v: string) => !!v || this.$t('editor.tableRequired')
      ],
      limitRules: [
        (v: number) => (!v || (v && v > 0)) || this.$t('editor.limitTooSmall')
      ]
    }
  },
  methods: {
    filterNumbersOnly(event: KeyboardEvent): void {
      filterNumbersOnly(event);
    }
  },
  watch: {
    currentQuery: {
      handler() {
        const query = (this.currentQuery as Query);

        if ((query.limit?.toString()) === '') {
          query.limit = undefined;
        }
      },
      deep: true
    }
  },
  beforeMount() {
    this.currentQuery = this.query;
  }
})
</script>

<style scoped>

</style>