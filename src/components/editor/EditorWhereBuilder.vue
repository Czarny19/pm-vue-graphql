<template>
  <v-card-text class="pa-3 pt-0 pb-6">
    <div class="elevation-6 pt-4">
      <v-container fluid class="pa-4">
        <v-row v-for="(wherePart, index) in whereParts" :key="index">
          <v-col v-if="index !== 0" cols="auto">
            <v-btn fab small v-if="wherePart.isAnd" @click="setPartIsAnd(wherePart)" color="info">
              {{ i18n('editor.and') }}
            </v-btn>

            <v-btn fab small v-else @click="setPartIsAnd(wherePart)" color="info">
              {{ i18n('editor.or') }}
            </v-btn>
          </v-col>

          <v-col v-else cols="auto">
            <v-btn fab small color="transparent" disabled></v-btn>
          </v-col>

          <v-col cols="3">
            <v-select
                class="pa-0"
                color="accent"
                item-color="accent"
                v-model="wherePart.field"
                :items="fieldNames"
                :label="i18n('editor.field')"
                required
                append-icon="fa-chevron-down">
            </v-select>
          </v-col>

          <v-col cols="1">
            <v-text-field
                v-if="wherePart.field"
                class="pa-0"
                color="accent"
                :value="fieldType(wherePart)"
                readonly
                :label="i18n('editor.variableType')">
            </v-text-field>
          </v-col>

          <v-col cols="2">
            <v-select
                v-if="wherePart.field"
                class="pa-0"
                color="accent"
                item-color="accent"
                v-model="wherePart.operator"
                :items="operators(wherePart)"
                :label="i18n('editor.operation')"
                required
                append-icon="fa-chevron-down">
            </v-select>
          </v-col>

          <v-col cols="4">
            <v-select
                v-if="wherePart.operator"
                class="pa-0"
                color="accent"
                item-color="accent"
                v-model="wherePart.variable"
                :items="variables(wherePart)"
                :label="i18n('editor.variable')"
                required
                append-icon="fa-chevron-down">
            </v-select>
          </v-col>

          <v-spacer></v-spacer>

          <v-col cols="1" class="text-end">
            <v-btn fab small @click="deletePart(wherePart)" color="error">
              <v-icon>fa-times</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-row>
          <v-col class="text-start">
            <IconButton :label="i18n('editor.addWherePart')" color="success" icon="fa-plus" @click="addWherePart"/>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-card-text>
</template>

<script lang="ts">
import Vue from "vue";
import IconButton from "@/components/button/IconButton.vue";
import {QueryWhere, SchemaItemField} from "@/lib/types";
import * as graphql_gen from "@/lib/graphql_gen";

export default Vue.extend({
  name: 'EditorWhereBuilder',
  components: {IconButton},
  props: {
    object: Object,
    fields: Array
  },
  data() {
    return {
      currentObject: {},
      whereParts: []
    }
  },
  computed: {
    fieldNames(): string[] {
      return (this.fields as SchemaItemField[]).map((field) => field.name).filter((field) => !field.includes('.'))
    }
  },
  methods: {
    operators(wherePart: QueryWhere): string [] {
      const field = (this.fields as SchemaItemField []).filter((field) => field.name === wherePart.field)[0];

      switch (field.type) {
        case 'String':
          return graphql_gen.stringOperators;
        case 'Int':
        case 'float8':
          return graphql_gen.numberOperators;
        case 'Boolean':
          return graphql_gen.boolOperators;
        case 'date':
          return graphql_gen.dateOperators;
        case 'time':
          return graphql_gen.timeOperators;
        default:
          return graphql_gen.stringOperators;
      }
    },
    fieldType(wherePart: QueryWhere): string {
      const field = (this.fields as SchemaItemField []).filter((field) => field.name === wherePart.field)[0];
      return field.type
    },
    variables(wherePart: QueryWhere): string [] {
      const field = (this.fields as SchemaItemField []).filter((field) => field.name === wherePart.field)[0];
      const type = field.type
      const obj = this.object as { variables: string }
      const variables = graphql_gen.mapModelStringToQueryVariableArray(obj.variables ?? '')

      return variables?.filter((variable) => variable.type === type).map((variable) => variable.name) ?? []
    },
    addWherePart(): void {
      const newPart = {field: '', operator: '', variable: '', isAnd: true};
      (this.whereParts as QueryWhere[]).push(newPart)
    },
    setPartIsAnd(wherePart: QueryWhere): void {
      wherePart.isAnd = !wherePart.isAnd
    },
    deletePart(wherePart: QueryWhere): void {
      this.whereParts.forEach((part, index) => {
        if (part == wherePart) {
          this.whereParts.splice(index, 1)
        }
      })
    }
  },
  watch: {
    query: {
      handler() {
        this.currentObject = this.object
      },
      deep: true
    },
    whereParts: {
      handler() {
        const obj = this.currentObject as { where: string }
        obj.where = this.whereParts.map(wherePart => (JSON.stringify(wherePart))).join(';')
      },
      deep: true
    }
  },
  beforeMount() {
    const obj = this.object as { where: string }
    (this.whereParts as QueryWhere[]) = graphql_gen.mapModelStringToQueryWhereArray(obj.where ?? '')
    this.currentObject = this.object
  }
})
</script>

<style scoped>

</style>