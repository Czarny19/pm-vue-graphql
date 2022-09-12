<template>
  <div>
    <div class="text-body-1 pl-3 pr-3 pt-1 pb-1 mt-2 mb-3 editor--action-tab">
      {{ i18n('editor.actionTarget') }}
    </div>

    <v-select
        color="accent"
        outlined dense hide-details
        :label="i18n('editor.actionTarget')"
        :items="['', ...pages]"
        v-model="currentProp.target"
        item-value="id"
        item-text="name"
        item-color="accent"
    />

    <div class="text-body-1 pl-3 pr-3 pt-1 pb-1 mt-4 editor--action-tab">
      {{ i18n('editor.actionVars') }}
    </div>

    <div v-for="(variable, index) in currentProp.variables" :key="index">
      <div class="text-start text-body-2 pt-3 pl-1 text--secondary">
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
          item-color="accent"
          @change="clearVarValues(variable)"
      />

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
          item-color="accent"
      />

      <v-select
          v-if="variable.varType === 1"
          class="pt-3"
          color="accent"
          outlined dense hide-details
          :label="i18n('editor.actionVarTable')"
          :items="['', ...tablesNames]"
          v-model="variable.table"
          item-value="id"
          item-text="name"
          item-color="accent"
      />

      <v-select
          v-if="variable.varType === 1 && variable.table"
          class="pt-3"
          color="accent"
          outlined dense hide-details
          :label="i18n('editor.actionVar')"
          :items="['', ...getFieldsForTable(variable.table)]"
          v-model="variable.tableVar"
          item-value="id"
          item-text="name"
          item-color="accent"
      />

      <v-select
          v-if="variable.varType === 2"
          class="pt-3"
          color="accent"
          outlined dense hide-details
          :label="i18n('editor.actionVar')"
          :items="['', ...params]"
          v-model="variable.paramVar"
          item-value="id"
          item-text="name"
          item-color="accent"
      />

      <v-divider class="mt-3 mb-3"></v-divider>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {ActionProp, ActionPropVariable, Page, SchemaItem, SchemaItemField} from "@/lib/types";
import {getAllTableFieldsWithObjectRelations} from "@/lib/schema";

export default Vue.extend({
  name: 'GuiEditorActionGoToPage',
  props: {
    prop: Object,
    page: Object,
    pages: Array,
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
      return (this.pages as Page[])?.find((page) => page.id === this.prop.target);
    },
    tablesNames(): string [] {
      return (this.schema as { name: string }[]).slice()?.map((table) => table.name);
    },
    varTypes(): { id: number; name: string }[] {
      return [
        {id: 0, name: this.$t('editor.actionVarsPage').toString()},
        {id: 1, name: this.$t('editor.actionVarsTable').toString()},
        {id: 2, name: this.$t('editor.actionVarsParams').toString()}
      ];
    },
    params(): string[] {
      return this.page.params.split(';');
    }
  },
  methods: {
    getFieldsForTable(tableName: string): SchemaItemField[] {
      return getAllTableFieldsWithObjectRelations(tableName, this.schema as SchemaItem[]);
    },
    clearVarValues(variable: ActionPropVariable) {
      variable.paramVar = ''
      variable.tableVar = ''
      variable.pageVar = -1
    }
  },
  watch: {
    currentProp: {
      handler() {
        if ((this.currentProp as ActionProp).target !== this.currentPageId) {
          this.currentPageId = (this.currentProp as ActionProp).target;

          if (this.selectedPage) {
            (this.currentProp as ActionProp).variables = [];
            const pageParams = this.selectedPage.params.length ? this.selectedPage.params.split(';') : [];

            pageParams.forEach((param) => {
              (this.currentProp as ActionProp).variables.push({
                name: param, type: 'String', value: '', varType: -1, pageVar: -1, table: '', tableVar: '', paramVar: ''
              })
            });
          }
        }
      },
      deep: true
    }
  },
  async beforeMount() {
    this.currentProp = this.prop;
    this.currentPageId = (this.currentProp as ActionProp).target;
  }
})
</script>

<style scoped>

</style>