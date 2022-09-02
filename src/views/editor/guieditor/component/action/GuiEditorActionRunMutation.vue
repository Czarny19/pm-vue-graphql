<template>
  <div>
    <v-select
        color="accent"
        outlined dense hide-details
        :label="i18n('editor.actionTarget')"
        :items="['', ...mutations]"
        v-model="currentProp.target"
        item-value="id"
        item-text="name"
        item-color="accent">
    </v-select>

    <div class="text-start text-body-2 pt-4 pl-1">
      {{ i18n('editor.variables') }}
    </div>

    <div v-for="(variable, index) in currentProp.variables" :key="index">
      <v-select
          class="pt-3"
          color="accent"
          outlined dense hide-details
          :label="`${variable.name} (${variable.type})`"
          :items="['', ...variables]"
          v-model="variable.pageVar"
          item-value="id"
          item-text="name"
          item-color="accent">
      </v-select>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {ActionProp, Mutation} from "@/lib/types";
import * as graphql_gen from "@/lib/graphql_gen";

export default Vue.extend({
  name: 'GuiEditorActionRunMutation',
  props: {
    prop: Object,
    mutations: Array,
    variables: Array
  },
  data() {
    return {
      currentProp: {},
      currentMutationId: -1
    }
  },
  computed: {
    selectedMutation(): Mutation | undefined {
      return (this.mutations as Mutation[])?.find((mutation) => mutation.id === this.prop.target)
    }
  },
  watch: {
    currentProp: {
      handler() {
        if ((this.currentProp as ActionProp).target !== this.currentMutationId) {
          this.currentMutationId = (this.currentProp as ActionProp).target

          if (this.selectedMutation) {
            const mutationVars = graphql_gen.mapModelStringToQueryVariableArray(this.selectedMutation.variables ?? '')

            mutationVars.forEach((variable) => {
              (this.currentProp as ActionProp).variables.push({
                name: variable.name,
                type: variable.type,
                value: variable.value,
                pageVar: -1
              })
            })
          }
        }
      },
      deep: true
    }
  },
  async beforeMount() {
    this.currentProp = this.prop
    this.currentMutationId = (this.currentProp as ActionProp).target
  }
})
</script>

<style scoped>

</style>