<template>
  <v-card-text class="pa-3 pt-0 pb-6">
    <div class="elevation-6 pt-6 pb-2">
      <v-container fluid>
        <v-row v-for="(wherePart, index) in whereParts" :key="index">
          <v-col v-if="index !== 0" cols="1">
            <v-btn fab small v-if="wherePart.isAnd" @click="setPartIsAnd(wherePart)" color="info">
              {{ i18n('editor.and') }}
            </v-btn>

            <v-btn fab small v-else @click="setPartIsAnd(wherePart)" color="info">
              {{ i18n('editor.or') }}
            </v-btn>
          </v-col>

          <v-col v-else cols="1"></v-col>

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

          <v-col cols="5">
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

          <v-col cols="1" class="text-center">
            <v-btn fab small @click="deletePart(wherePart)" color="error">
              <v-icon>fa-times</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-row>
          <v-col class="text-start">
            <v-btn @click="addWherePart" color="success">{{ i18n('editor.addWherePart') }}</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-card-text>
</template>

<script lang="ts">
import Vue from "vue";
import {Query, QueryField, QueryWherePart} from "@/plugins/types";
import {mapVariablesStringToObject, mapWhereStringToObject, numberOperators, stringOperators} from "@/plugins/query";

export default Vue.extend({
  name: 'QueryWhereBuilder',
  props: {
    query: Object,
    fields: Array
  },
  data() {
    return {
      currentQuery: {},
      whereParts: []
    }
  },
  computed: {
    fieldNames(): string[] {
      return (this.fields as [{ name: string }]).map((field) => field.name)
    }
  },
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    },
    operators(wherePart: QueryWherePart): string [] {
      const field = (this.fields as QueryField []).filter((field) => field.name === wherePart.field)[0];
      const type = field.type.ofType.name

      if (type === 'String') {
        return stringOperators
      }

      return numberOperators
    },
    variables(wherePart: QueryWherePart): string [] {
      const field = (this.fields as QueryField []).filter((field) => field.name === wherePart.field)[0];
      const type = field.type.ofType.name
      const variables = mapVariablesStringToObject((this.query as Query).variables ?? '')

      return variables?.filter((variable) => variable.type === type).map((variable) => variable.name) ?? []
    },
    addWherePart(): void {
      const newPart = {field: '', operator: '', variable: '', isAnd: true};
      (this.whereParts as QueryWherePart[]).push(newPart)
    },
    setPartIsAnd(wherePart: QueryWherePart): void {
      wherePart.isAnd = !wherePart.isAnd
    },
    deletePart(wherePart: QueryWherePart): void {
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
        this.currentQuery = this.query
      },
      deep: true
    },
    whereParts: {
      handler() {
        const query = (this.currentQuery as Query)
        query.where = this.whereParts.map(wherePart => (JSON.stringify(wherePart))).join(';')
      },
      deep: true
    }
  },
  beforeMount() {
    (this.whereParts as QueryWherePart[]) = mapWhereStringToObject((this.query as Query).where ?? '')
    this.currentQuery = this.query
  }
})
</script>

<style scoped>

</style>