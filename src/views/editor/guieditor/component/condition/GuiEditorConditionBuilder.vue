<template>
  <div>
    <div class="secondary text-start text-body-2 pa-3 pl-6">
      {{ conditionsGroup.label }}
    </div>

    <v-container fluid class="pa-4">
      <div v-for="(prop, index) in conditionsGroup.props" :key="index">
        <div class="text-body-1 pl-3 pr-3 pt-1 pb-1 mt-1 mb-3 editor--action-tab">
          {{ `${i18n('editor.condition')}: ${index + 1}` }}
        </div>

        <v-btn class="mt-2 mb-4 ml-auto mr-2" block small color="error" @click="deleteCondition(prop)">
          {{ `${i18n('editor.deleteCondition')}: ${index + 1}` }}
        </v-btn>

        <v-select
            class="pt-2"
            color="accent"
            outlined dense hide-details
            :label="i18n('editor.conditionTable')"
            :items="['', ...tablesNames]"
            v-model="prop.table"
            item-value="id"
            item-text="name"
            item-color="accent"
        />

        <v-select
            v-if="prop.table"
            class="pt-2"
            color="accent"
            outlined dense hide-details
            :label="i18n('editor.conditionField')"
            :items="['', ...getFieldsForTable(prop.table)]"
            v-model="prop.field"
            item-value="id"
            item-text="name"
            item-color="accent"
        />

        <template v-if="prop.table && prop.field">
          <GuiEditorConditionValue
              :prop="prop"
              :widget="widget"
              :schema="schema"
              :fields="getFieldsForTable(prop.table)"
          />
        </template>

        <v-divider class="mt-3 mb-3"></v-divider>
      </div>

      <v-row no-gutters>
        <v-col>
          <IconButton
              class="mt-1 mb-1"
              :label="i18n('editor.addCondition')"
              color="success"
              icon="fa-plus"
              @click="addCondition"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import IconButton from "@/components/button/IconButton.vue";
import GuiEditorConditionValue from "@/views/editor/guieditor/component/condition/GuiEditorConditionValue.vue";
import {ConditionProp, SchemaItem, SchemaItemField} from "@/lib/types";
import {getAllTableFieldsWithObjectRelations} from "@/lib/schema";

export default Vue.extend({
  name: 'GuiEditorConditionBuilder',
  components: {GuiEditorConditionValue, IconButton},
  props: {
    conditionsGroup: Object,
    widget: Object,
    schema: Array
  },
  data() {
    return {
      conditionGroupProps: []
    }
  },
  computed: {
    tablesNames(): string [] {
      return (this.schema as { name: string }[]).slice()?.map((table) => table.name);
    }
  },
  methods: {
    getFieldsForTable(tableName: string): SchemaItemField[] {
      return getAllTableFieldsWithObjectRelations(tableName, this.schema as SchemaItem[]);
    },
    addCondition(): void {
      (this.conditionGroupProps as ConditionProp[]).push({
        id: this.conditionGroupProps.length + 1, table: '', field: '', condition: '=', value: ''
      });
    },
    deleteCondition(condition: ConditionProp): void {
      (this.conditionGroupProps as ConditionProp[]).forEach((condProp, index) => {
        if (condProp == condition) {
          this.conditionGroupProps.splice(index, 1);
        }
      });
    }
  },
  beforeMount() {
    this.conditionGroupProps = this.conditionsGroup.props;
  }
})
</script>

<style scoped>

</style>