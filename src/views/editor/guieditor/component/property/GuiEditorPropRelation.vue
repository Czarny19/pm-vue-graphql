<template>
  <div>
    <v-select
        v-if="relationsVisible"
        class="pt-3"
        color="accent"
        outlined dense hide-details
        :label="prop.label"
        :items="['', ...relationships]"
        v-model="currentProp.value"
        item-value="name"
        item-text="name"
        item-color="accent"
    />

    <v-select
        v-if="currentProp.value"
        class="pt-3"
        color="accent"
        outlined dense hide-details
        :label="i18n('editor.orderBy')"
        :items="['', ...fields]"
        v-model="currentProp.orderBy"
        item-value="name"
        item-text="name"
        item-color="accent"
    />

    <v-checkbox
        v-if="currentProp.value"
        class="pb-1 pl-2"
        color="accent"
        off-icon="fa-times-circle"
        on-icon="fa-check-circle"
        hide-details
        :label="i18n('editor.orderByAsc')"
        v-model="currentProp.orderAsc"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {AppWidgetProp, SchemaItem, SchemaItemField} from "@/lib/types";
import {getAllTableFieldsWithObjectRelations, getTableArrayRelations} from "@/lib/schema";
import {getTableNameForWidget} from "@/lib/widget";

export default Vue.extend({
  name: 'GuiEditorPropRelation',
  props: {
    prop: Object,
    widget: Object,
    schema: Array
  },
  data() {
    return {
      currentProp: {},
      relationships: [],
      fields: []
    }
  },
  computed: {
    tableName(): string {
      return getTableNameForWidget(this.widget, 'source', 'dataTable');
    },
    relationsVisible(): boolean {
      return this.tableName.length > 0;
    }
  },
  watch: {
    tableName(): void {
      (this.relationships as SchemaItemField[]) = getTableArrayRelations(this.tableName, this.schema as SchemaItem[]);
    },
    currentProp: {
      handler() {
        const value = (this.currentProp as AppWidgetProp).value;
        const relationTable = this.relationships.find((relation) => (relation as SchemaItemField).name === value);

        if (value && relationTable) {
          (this.fields as SchemaItemField[]) =
              getAllTableFieldsWithObjectRelations((relationTable as SchemaItemField).type, this.schema as SchemaItem[]);
        }
      },
      deep: true
    }
  },
  beforeMount() {
    this.currentProp = this.prop;

    const tableName = getTableNameForWidget(this.widget, 'source', 'dataTable');
    (this.relationships as SchemaItemField[]) = getTableArrayRelations(tableName, this.schema as SchemaItem[]);
  }
})
</script>

<style scoped>

</style>