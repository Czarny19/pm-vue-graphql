<template>
  <v-card-text class="pa-3 pt-0 pb-6">
    <div class="elevation-6 pt-4">
      <v-container fluid class="pa-4">
        <v-row v-for="(field, index) in fields" :key="index">
          <v-col cols="auto">
            <v-btn fab small v-if="!field.isNullable" color="info" class="disable-events">
              <v-icon>fa-asterisk</v-icon>
            </v-btn>

            <v-btn fab small v-else-if="fieldIsSelected(field)" @click="unselectField(field)" color="success">
              <v-icon>fa-check</v-icon>
            </v-btn>

            <v-btn v-else fab small @click="selectField(field)" color="error">
              <v-icon>fa-times</v-icon>
            </v-btn>
          </v-col>

          <v-col cols="5">
            <v-text-field
                class="pa-0"
                color="accent"
                v-model="field.name"
                :label="i18n('editor.field')"
                readonly>
            </v-text-field>
          </v-col>

          <v-col cols="auto">
            <v-select
                v-if="fieldIsSelected(field)"
                class="pa-0"
                color="accent"
                item-color="accent"
                v-model="field.variable"
                :items="variables(field)"
                :label="i18n('editor.variable')"
                required
                append-icon="fa-chevron-down">
            </v-select>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-card-text>
</template>

<script lang="ts">
import Vue from "vue";
import {Mutation, QueryObject, SchemaItemField} from "@/lib/types";
import {mapModelStringToQueryObjectArray, mapModelStringToQueryVariableArray} from "@/lib/graphql_gen";

export default Vue.extend({
  name: 'MutationObject',
  props: {
    mutation: Object,
    fields: Array
  },
  data() {
    return {
      currentMutation: {},
      selectedFields: []
    }
  },
  computed: {
    selectedFieldsTyped(): QueryObject[] {
      return this.selectedFields as QueryObject[]
    }
  },
  methods: {
    variables(field: SchemaItemField): string [] {
      const type = field.type
      const mutation = this.mutation as Mutation
      const variables = mapModelStringToQueryVariableArray(mutation.variables ?? '')

      return variables?.filter((variable) => variable.type === type).map((variable) => variable.name) ?? []
    },
    fieldIsSelected(field: SchemaItemField): boolean {
      return this.selectedFieldsTyped.filter((selectedField) => selectedField.field === field.name).length > 0
    },
    selectField(field: SchemaItemField): void {
      const selectedField = {field: field.name, type: field.type, variable: ''};
      this.selectedFieldsTyped.push(selectedField)
    },
    unselectField(field: SchemaItemField): void {
      this.selectedFields.forEach((selectedField, index) => {
        if ((selectedField as QueryObject).field == field.name) {
          this.selectedFields.splice(index, 1)
        }
      })
    }
  },
  watch: {
    query: {
      handler() {
        this.currentMutation = this.mutation
      },
      deep: true
    },
    selectedFields: {
      handler() {
        const mutation = this.mutation as Mutation
        mutation.objects = this.selectedFields.map(selected => (JSON.stringify(selected))).join(';')
      },
      deep: true
    }
  },
  beforeMount() {
    console.log(this.fields);
    const mutation = this.mutation as Mutation
    (this.selectedFields as QueryObject[]) = mapModelStringToQueryObjectArray(mutation.objects ?? '');

    (this.fields as SchemaItemField[])?.forEach((field) => {
      if (!field.isNullable) {
        const fieldSelected = this.selectedFieldsTyped.filter((fld) => fld.field === field.name).length

        if (!fieldSelected) {
          this.selectedFieldsTyped.push({field: field.name, type: field.type, variable: ''})
        }
      }
    })

    this.currentMutation = this.mutation
  }
})
</script>

<style scoped>

</style>