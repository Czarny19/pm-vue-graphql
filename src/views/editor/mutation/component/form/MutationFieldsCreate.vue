<template>
  <v-card-text class="pa-3 pt-0 pb-6">
    <div class="elevation-6 pt-4">
      <v-container fluid class="pa-4">
        <v-row v-for="(field, index) in mutationFields" :key="index">
          <v-col cols="auto">
            <v-btn fab x-small v-if="!field.isNullable" color="info" class="disable-events">
              <v-icon small>fa-asterisk</v-icon>
            </v-btn>

            <v-btn fab x-small v-else-if="fieldIsSelected(field)" @click="unselectField(field)" color="success">
              <v-icon small>fa-check</v-icon>
            </v-btn>

            <v-btn v-else fab x-small @click="selectField(field)" color="error">
              <v-icon small>fa-times</v-icon>
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

          <v-col cols="1">
            <v-text-field
                class="pa-0"
                color="accent"
                :value="field.type"
                readonly
                :label="i18n('editor.variableType')">
            </v-text-field>
          </v-col>

          <v-col cols="auto">
            <v-select
                v-if="fieldIsSelected(field)"
                class="pa-0"
                color="accent"
                item-color="accent"
                :value="selectedFieldsVariables[index]"
                :items="variables(field)"
                :label="i18n('editor.variable')"
                required
                append-icon="fa-chevron-down"
                @change="(event) => setFieldVariable(event, field, index)">
            </v-select>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-card-text>
</template>

<script lang="ts">
import Vue from "vue";
import {Mutation, QuerySetValue, SchemaItemField} from "@/lib/types";
import {fieldAutoVar, mapModelStringToQuerySetValueArray, mapModelStringToQueryVariableArray} from "@/lib/graphql_gen";

export default Vue.extend({
  name: 'MutationFieldsCreate',
  props: {
    mutation: Object,
    fields: Array
  },
  data() {
    return {
      currentMutation: {},
      selectedFields: [],
      selectedFieldsVariables: []
    }
  },
  computed: {
    selectedFieldsTyped(): QuerySetValue[] {
      return this.selectedFields as QuerySetValue[]
    },
    mutationFields(): SchemaItemField[] {
      return (this.fields as SchemaItemField[]).filter((field) => !field.name.includes('.'))
    }
  },
  methods: {
    variables(field: SchemaItemField): string [] {
      const type = field.type
      const mutation = this.mutation as Mutation
      const variables = mapModelStringToQueryVariableArray(mutation.variables ?? '')

      const usableVars = variables?.filter((variable) => variable.type === type).map((variable) => variable.name) ?? []

      return [fieldAutoVar, ...usableVars]
    },
    fieldIsSelected(field: SchemaItemField): boolean {
      return this.selectedFieldsTyped.filter((selectedField) => selectedField.name === field.name).length > 0
    },
    selectField(field: SchemaItemField): void {
      const selectedField = {name: field.name, type: field.type, variable: ''};
      this.selectedFieldsTyped.push(selectedField)
    },
    unselectField(field: SchemaItemField): void {
      this.selectedFields.forEach((selectedField, index) => {
        if ((selectedField as QuerySetValue).name == field.name) {
          this.selectedFields.splice(index, 1)
        }
      })
    },
    setFieldVariable(event: string, field: SchemaItemField, index: number): void {
      (this.selectedFieldsVariables[index] as string) = event;

      this.selectedFields.forEach((selectedField) => {
        if ((selectedField as QuerySetValue).name == field.name) {
          (selectedField as QuerySetValue).variable = event;
        }
      });
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
        mutation.fields = this.selectedFields.map(selected => (JSON.stringify(selected))).join(';')
      },
      deep: true
    }
  },
  beforeMount() {
    const mutation = this.mutation as Mutation;
    (this.selectedFields as QuerySetValue[]) = mapModelStringToQuerySetValueArray(mutation.fields ?? '');

    (this.fields as SchemaItemField[])?.filter((field) => !field.name.includes('.')).forEach((field) => {
      if (!field.isNullable) {
        const fieldSelected = this.selectedFieldsTyped.filter((fld) => fld.name === field.name).length

        if (!fieldSelected) {
          this.selectedFieldsTyped.push({name: field.name, type: field.type, variable: ''})
        }
      }
    });

    (this.selectedFields as QuerySetValue[]).forEach((field) => {
      (this.selectedFieldsVariables as string[]).push(field.variable)
    });

    this.currentMutation = this.mutation;
  }
})
</script>

<style scoped>

</style>