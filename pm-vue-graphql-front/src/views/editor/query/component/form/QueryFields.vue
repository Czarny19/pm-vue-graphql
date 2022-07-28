<template>
  <v-card-text class="pa-3 pt-0 pb-6">
    <div class="elevation-6 text-start pb-4">
      <v-btn v-if="!allFieldsSelected" class="ma-4" color="info" @click="selectAllFields">
        {{ i18n('editor.selectAll') }}
      </v-btn>

      <v-btn v-else class="ma-4" color="error" @click="selectAllFields">
        {{ i18n('editor.unselectAll') }}
      </v-btn>

      <v-data-table
          disable-sort
          v-model="selectedFields"
          :headers="fieldHeaders"
          :items="currentTable?.fields"
          :single-select="false"
          hide-default-footer
          item-key="name"
          show-select
          class="elevation-0 ml-4 mr-4 pointer"
          @click:row="selectField">
      </v-data-table>
    </div>
  </v-card-text>
</template>

<script lang="ts">
import Vue from "vue";
import {Query, QueryField} from "@/plugins/types";

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
        (this.selectedFields as QueryField []) = this.currentTable?.fields
        return
      }

      this.selectedFields = []
    },
    selectField(selectedField: QueryField): void {
      for (const field of (this.selectedFields as QueryField[])) {
        const index = (this.selectedFields as QueryField[]).indexOf(field);

        if (field.name == selectedField.name) {
          this.selectedFields.splice(index, 1)
          return
        }
      }

      (this.selectedFields as QueryField[]).push(selectedField)
    }
  },
  watch: {
    selectedFields() {
      const query = (this.currentQuery as Query)
      this.allFieldsSelected = this.selectedFields.length === this.currentTable.fields.length
      query.fields = this.selectedFields
          .map((field) => (field as { name: string }).name)
          .join(',')
          .replaceAll(' ', '')
    }
  },
  beforeMount() {
    this.currentQuery = this.query;

    (this.currentTable?.fields as QueryField[]).forEach((tbField) => {
      (this.query as Query).fields.replaceAll(' ', '').split(',').forEach((qrField) => {
        if (tbField.name === qrField) {
          (this.selectedFields as QueryField[]).push(tbField)
        }
      })
    })
  },
})
</script>

<style scoped>

</style>