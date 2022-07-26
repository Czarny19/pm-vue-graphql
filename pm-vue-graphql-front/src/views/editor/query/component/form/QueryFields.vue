<template>
  <v-card-text class="pa-3 pt-0 pb-6">
    <div class="elevation-6">
      <v-data-table
          dense
          disable-sort
          v-model="selectedFields"
          :headers="fieldHeaders"
          :items="currentTable?.fields"
          :single-select="false"
          hide-default-footer
          item-key="name"
          show-select
          class="elevation-0">

        <template v-slot:[`header.data-table-select`]>
          <v-checkbox
              color="accent"
              on-icon="fa-check"
              off-icon="fa-times"
              :value="allFieldsSelected"
              @change="selectAllFields">
          </v-checkbox>
        </template>

        <template v-slot:[`item.data-table-select`]="{ isSelected, select }">
          <v-checkbox
              color="accent"
              on-icon="fa-check"
              off-icon="fa-times"
              :value="isSelected"
              @change="select"/>
        </template>
      </v-data-table>
    </div>
  </v-card-text>
</template>

<script lang="ts">
import Vue from "vue";
import {Query} from "@/plugins/types";

export default Vue.extend({
  name: 'QueryFields',
  props: {
    query: Object,
    currentTable: Object,
    tablesNames: Array
  },
  data() {
    return {
      currentQuery: {},
      selectedFields: [],
      allFieldsSelected: false
    }
  },
  computed: {
    fieldHeaders(): { text: string; value: string }[] {
      return [
        {text: this.$t('datasource.fieldName').toString(), value: 'name'},
        {text: this.$t('datasource.fieldType').toString(), value: 'type.ofType.name'}
      ]
    }
  },
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    },
    selectAllFields(): void {
      this.allFieldsSelected = !this.allFieldsSelected

      if (this.allFieldsSelected) {
        (this.selectedFields as { name: string, type: { ofType: { name: string } } }[]) = this.currentTable?.fields
        return
      }

      this.selectedFields = []
    }
  },
  watch: {
    query() {
      this.currentQuery = this.query
    },
    selectedFields() {
      const query = (this.currentQuery as Query)
      this.allFieldsSelected = this.selectedFields.length === this.currentTable.fields.length
      query.fields = this.selectedFields.map((field) => (field as { name: string }).name).join(',')
    }
  },
  beforeMount() {
    this.currentQuery = this.query
  }
})
</script>

<style scoped>

</style>