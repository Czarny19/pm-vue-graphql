<template>
  <div>
    <v-select
        color="accent"
        outlined dense hide-details
        :label="i18n('editor.actionTarget')"
        :items="['', ...pages]"
        v-model="currentProp.target"
        item-value="id"
        item-text="name"
        item-color="accent">
    </v-select>

    <div class="text-start text-body-1 pt-4 pl-1">
      {{ i18n('editor.actionVars') }}
    </div>

    <div v-for="(variable, index) in currentProp.variables" :key="index">
      <div class="text-start text-body-2 pt-4 pl-1">
        {{ `${variable.name} (${variable.type})` }}
      </div>

      <v-select
          class="pt-3"
          color="accent"
          outlined dense hide-details
          :label="i18n('editor.actionVarType')"
          :items="varTypes"
          v-model="variable.varType"
          item-value="id"
          item-text="name"
          item-color="accent">
      </v-select>

      <v-select
          v-if="variable.varType === 0"
          class="pt-3"
          color="accent"
          outlined dense hide-details
          :label="i18n('editor.actionVar')"
          :items="['', ...variables]"
          v-model="variable.pageVar"
          item-value="id"
          item-text="name"
          item-color="accent">
      </v-select>

      <v-select
          v-if="variable.varType === 1"
          class="pt-3"
          color="accent"
          outlined dense hide-details
          :label="i18n('editor.actionVar')"
          :items="['', ...fields]"
          v-model="variable.tableVar"
          item-value="id"
          item-text="name"
          item-color="accent">
      </v-select>

      <v-select
          v-if="variable.varType === 2"
          class="pt-3"
          color="accent"
          outlined dense hide-details
          :label="i18n('editor.actionVar')"
          :items="['', ...params]"
          v-model="variable.tableVar"
          item-value="id"
          item-text="name"
          item-color="accent">
      </v-select>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {ActionProp, Page, SchemaItem, SchemaItemField} from "@/lib/types";
import {getTableNameForWidget} from "@/lib/widget";
import {getAllTableFieldsWithRelations} from "@/lib/schema";

export default Vue.extend({
  name: 'GuiEditorActionGoToPage',
  props: {
    prop: Object,
    page: Object,
    pages: Array,
    widget: Object,
    schema: Array,
    variables: Array
  },
  data() {
    return {
      currentProp: {},
      currentPageId: -1
    }
  },
  computed: {
    selectedPage(): Page | undefined {
      return (this.pages as Page[])?.find((page) => page.id === this.prop.target)
    },
    varTypes(): { id: number; name: string }[] {
      return [
        {id: 0, name: this.$t('editor.actionVarsPage').toString()},
        {id: 1, name: this.$t('editor.actionVarsTable').toString()},
        {id: 2, name: this.$t('editor.actionVarsParams').toString()}
      ]
    },
    tableName(): string {
      return getTableNameForWidget(this.widget)
    },
    fields(): SchemaItemField[] {
      return getAllTableFieldsWithRelations(this.tableName, this.schema as SchemaItem[])
    },
    params(): string[] {
      return this.page.params.split(';')
    }
  },
  watch: {
    currentProp: {
      handler() {
        if ((this.currentProp as ActionProp).target !== this.currentPageId) {
          this.currentPageId = (this.currentProp as ActionProp).target

          if (this.selectedPage) {
            (this.currentProp as ActionProp).variables = []
            const pageParams = this.selectedPage.params.length ? this.selectedPage.params.split(';') : []

            pageParams.forEach((param) => {
              (this.currentProp as ActionProp).variables.push({
                name: param,
                type: 'String',
                value: '',
                varType: -1,
                pageVar: -1,
                tableVar: '',
                paramVar: ''
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
    this.currentPageId = (this.currentProp as ActionProp).target
  }
})
</script>

<style scoped>

</style>