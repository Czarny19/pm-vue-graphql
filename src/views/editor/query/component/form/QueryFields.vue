<template>
  <v-card-text class="pa-3 pt-0 pb-6">
    <div class="elevation-6 text-start pb-4">
      <v-btn v-if="!allFieldsSelected" class="ma-3" color="info" @click="selectAllFields">
        {{ i18n('editor.selectAll') }}
      </v-btn>

      <v-btn v-else class="ma-3" color="error" @click="selectAllFields">
        {{ i18n('editor.unselectAll') }}
      </v-btn>

      <v-data-table
          v-model="selectedFields"
          :headers="headers"
          :items="fields"
          disable-pagination
          hide-default-footer
          disable-sort
          item-key="name"
          show-select
          class="elevation-0 ml-3 mr-3 pointer"
          @click:row="selectField">

        <template v-slot:[`item.isNullable`]="{item}">
          <v-simple-checkbox
              dense
              :value="item.isNullable"
              on-icon="fa-check"
              off-icon="fa-times"
              class="disable-events">
          </v-simple-checkbox>
        </template>

      </v-data-table>
    </div>
  </v-card-text>
</template>

<script lang="ts">
import Vue from "vue";
import {Query, SchemaItemField} from "@/lib/types";

export default Vue.extend({
  name: 'QueryFields',
  props: {
    query: Object,
    fields: Array
  },
  data() {
    return {
      currentQuery: {},
      selectedFields: [],
      allFieldsSelected: false
    }
  },
  computed: {
    fieldsTyped(): SchemaItemField[] {
      return this.fields as SchemaItemField[]
    },
    headers(): { text: string; value: string, width: string, align?: string }[] {
      return [
        {text: this.$t('datasource.fieldName').toString(), value: 'name', width: '50%'},
        {text: this.$t('datasource.fieldType').toString(), value: 'type', width: '20%'},
        {text: this.$t('datasource.fieldIsNullable').toString(), value: 'isNullable', width: '30%', align: 'end'}
      ]
    }
  },
  methods: {
    selectAllFields(): void {
      this.allFieldsSelected = !this.allFieldsSelected

      if (this.allFieldsSelected) {
        (this.selectedFields as SchemaItemField []) = this.fieldsTyped
        return
      }

      this.selectedFields = []
    },
    selectField(selectedField: SchemaItemField): void {
      for (const field of (this.selectedFields as SchemaItemField[])) {
        const index = (this.selectedFields as SchemaItemField[]).indexOf(field);

        if (field.name == selectedField.name) {
          this.selectedFields.splice(index, 1)
          return
        }
      }

      (this.selectedFields as SchemaItemField[]).push(selectedField)
    }
  },
  watch: {
    selectedFields() {
      const query = (this.currentQuery as Query)
      this.allFieldsSelected = this.selectedFields.length === this.fields.length
      query.fields = this.selectedFields
          .map((field) => (field as { name: string }).name)
          .join(';')
          .replaceAll(' ', '')
    }
  },
  beforeMount() {
    const query = this.query as Query

    this.currentQuery = query;

    this.fieldsTyped.forEach((tbField) => {
      if (query.fields != null) {
        query.fields.replaceAll(' ', '').split(';').forEach((qrField) => {
          if (tbField.name === qrField) {
            (this.selectedFields as SchemaItemField[]).push(tbField)
          }
        })
      }
    })
  }
})
</script>

<style scoped>

</style>