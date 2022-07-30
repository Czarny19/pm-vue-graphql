<template>
  <v-card-text class="pa-3 pt-0 pb-6">
    <div class="elevation-6 pt-6 pb-2">
      <v-container class="pa-2 pl-4 pr-4">
        <v-row v-for="(variable, index) in variables" :key="index">
          <v-col cols="4">
            <v-text-field
                class="pa-0"
                color="accent"
                v-model="variable.name"
                :label="i18n('editor.variableName')">

              <template v-slot:prepend>
                <div class="text-h6">$</div>
              </template>
            </v-text-field>
          </v-col>

          <v-col cols="3">
            <v-select
                class="pa-0"
                color="accent"
                item-color="accent"
                item-text="display"
                item-value="type"
                v-model="variable.type"
                :items="variableTypes"
                :label="i18n('editor.variableType')"
                append-icon="fa-chevron-down">
            </v-select>
          </v-col>

          <v-col cols="3">
            <v-text-field
                v-if="variable.type"
                class="pa-0"
                color="accent"
                v-model="variable.value"
                :type="variableType(variable)"
                :label="i18n('editor.variableValue')">
            </v-text-field>
          </v-col>

          <v-col cols="1"></v-col>

          <v-col cols="1" class="text-center">
            <v-btn fab small color="error" @click="deleteVariable(variable)">
              <v-icon>fa-times</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-row>
          <v-col class="text-start">
            <v-btn color="success" @click="addVariable()">{{ i18n('editor.addVariable') }}</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-card-text>
</template>

<script lang="ts">
import Vue from "vue";
import {Query, QueryVariable} from "@/lib/types";
import {mapModelStringToQueryVariableArray} from "@/lib/query";

export default Vue.extend({
  name: 'QueryVariables',
  props: {query: Object},
  data() {
    return {
      currentQuery: {},
      variables: []
    }
  },
  computed: {
    variableTypes(): { type: string; display: string } [] {
      return [
        {type: 'String', display: this.$t('editor.variableString').toString()},
        {type: 'Int', display: this.$t('editor.variableInt').toString()},
        {type: 'float8', display: this.$t('editor.variableFloat').toString()}
      ]
    }
  },
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    },
    addVariable(): void {
      (this.variables as QueryVariable[]).push({name: '', type: '', value: ''})
    },
    deleteVariable(queryVariable: QueryVariable): void {
      this.variables.forEach((variable, index) => {
        if (variable == queryVariable) {
          this.variables.splice(index, 1)
        }
      })
    },
    variableType(queryVariable: QueryVariable): string {
      return queryVariable.type === 'String' ? 'text' : 'number'
    }
  },
  watch: {
    variables: {
      handler() {
        const query = (this.currentQuery as Query)
        query.variables = this.variables.map(orderBy => (JSON.stringify(orderBy))).join(';')
      },
      deep: true
    }
  },
  beforeMount() {
    (this.variables as QueryVariable[]) = mapModelStringToQueryVariableArray((this.query as Query).variables ?? '')
    this.currentQuery = this.query
  }
})
</script>

<style scoped>

</style>