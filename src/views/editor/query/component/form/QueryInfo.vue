<template>
  <v-card-text class="pa-3 pt-0 pb-6">
    <div class="elevation-6 pt-6">
      <v-text-field
          class="pa-4"
          color="accent"
          v-model="currentQuery.name"
          :label="i18n('editor.queryName')"
          :counter="50"
          :rules="queryNameRules"
          prepend-icon="fa-tag"
          required>
      </v-text-field>

      <v-select
          class="pa-4"
          color="accent"
          item-color="accent"
          v-model="currentQuery.table"
          :items="tablesNames"
          :label="i18n('editor.tableName')"
          :rules="queryTableRules"
          required
          append-icon="fa-chevron-down"
          prepend-icon="fa-table"
          item-text="name"
          item-value="id">
      </v-select>

      <v-text-field
          class="pa-4"
          color="accent"
          type="number"
          v-model="currentQuery.limit"
          :label="i18n('editor.limit')"
          :rules="limitRules"
          prepend-icon="fa-list-ol">
      </v-text-field>
    </div>
  </v-card-text>
</template>

<script lang="ts">
import Vue from "vue";

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
        (v: string) => !!v || this.$t('editor.limitWrongFormat'),
        (v: number) => (v && v > 0) || this.$t('editor.limitTooSmall')
      ]
    }
  },
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    }
  },
  beforeMount() {
    this.currentQuery = this.query
  }
})
</script>

<style scoped>

</style>