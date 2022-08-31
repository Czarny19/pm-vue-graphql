<template>
  <v-card-text class="pa-3 pt-0 pb-6">
    <div class="elevation-6 pt-4">
      <v-container fluid class="pa-4">
        <v-row v-for="(variable, index) in variables" :key="index">
          <v-col cols="4">
            <v-text-field
                class="pa-0"
                color="accent"
                v-model="variable.name"
                :counter="30"
                :rules="variableNameRules"
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
                :items="['', ...variableTypes]"
                :label="i18n('editor.variableType')"
                append-icon="fa-chevron-down">
            </v-select>
          </v-col>

          <v-col cols="3">
            <v-simple-checkbox
                v-if="variable.type && variableType(variable) === 'checkbox'"
                v-model="variable.value"
                on-icon="fa-check"
                off-icon="fa-times"
                class="mt-2 text-start">
            </v-simple-checkbox>

            <v-text-field
                v-else-if="variable.type"
                class="pa-0"
                color="accent"
                v-model="variable.value"
                :type="variableType(variable)"
                :label="i18n('editor.variableValue')">
            </v-text-field>
          </v-col>

          <v-spacer></v-spacer>

          <v-col cols="1" class="text-end">
            <v-btn fab x-small color="error" @click="deleteVariable(variable)">
              <v-icon small>fa-times</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-row>
          <v-col class="text-start">
            <IconButton :label="i18n('editor.addVariable')" color="success" icon="fa-plus" @click="addVariable"/>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-card-text>
</template>

<script lang="ts">
import Vue from "vue";
import IconButton from "@/components/button/IconButton.vue";
import {QueryVariable} from "@/lib/types";
import {mapModelStringToQueryVariableArray} from "@/lib/graphql_gen";

export default Vue.extend({
  name: 'EditorVariables',
  components: {IconButton},
  props: {
    object: Object
  },
  data() {
    return {
      currentObject: {},
      variables: [],
      variableNameRules: [
        (v: string) => !!v || this.$t('editor.variableNameRequired'),
        (v: string) => (v && v.length <= 30) || this.$t('editor.variableNameTooLong'),
        (v: string) => (v && !/[^a-zA-Z0-9]/.test(v)) || this.$t('editor.varaibleNameNoSpecialChars')
      ]
    }
  },
  computed: {
    variableTypes(): { type: string; display: string } [] {
      return [
        {type: 'String', display: this.$t('editor.variableString').toString() + ' (String)'},
        {type: 'Int', display: this.$t('editor.variableInt').toString() + ' (Int)'},
        {type: 'bigint', display: this.$t('editor.variableBigInt').toString() + ' (bigint)'},
        {type: 'float8', display: this.$t('editor.variableFloat').toString() + ' (float8)'},
        {type: 'Boolean', display: this.$t('editor.variableBoolean').toString() + ' (Boolean)'},
        {type: 'date', display: this.$t('editor.variableDate').toString() + ' (date)'},
        {type: 'time', display: this.$t('editor.variableTime').toString() + ' (time)'}
      ]
    }
  },
  methods: {
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
      switch (queryVariable.type) {
        case 'String':
          return 'text';
        case 'Int':
        case 'float8':
          return 'number';
        case 'Boolean':
          return 'checkbox';
        case 'date':
          return 'date';
        case 'time':
          return 'time';
        default:
          return 'text';
      }
    }
  },
  watch: {
    variables: {
      handler() {
        const obj = this.currentObject as { variables: string }
        obj.variables = this.variables.map(orderBy => (JSON.stringify(orderBy))).join(';')
      },
      deep: true
    }
  },
  beforeMount() {
    const obj = this.object as { variables: string }
    (this.variables as QueryVariable[]) = mapModelStringToQueryVariableArray(obj.variables ?? '')
    this.currentObject = this.object
  }
})
</script>

<style scoped>

</style>