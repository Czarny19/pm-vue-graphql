<template>
  <v-select
      v-if="fieldsVisible"
      class="pt-3"
      color="accent"
      outlined dense hide-details
      :label="prop.label"
      :items="['', ...fields]"
      v-model="currentProp.value"
      item-value="id"
      item-text="name"
      item-color="accent">
  </v-select>
</template>

<script lang="ts">
import Vue from "vue";
import {SchemaItem, SchemaItemField} from "@/lib/types";
import {getAllTableFieldsWithRelations} from "@/lib/schema";
import {getTableNameForWidget} from "@/lib/widget";

export default Vue.extend({
  name: 'GuiEditorPropTableField',
  props: {
    prop: Object,
    widget: Object,
    schema: Array
  },
  data() {
    return {
      currentProp: {},
      fields: []
    }
  },
  computed: {
    tableName(): string {
      return getTableNameForWidget(this.widget)
    },
    fieldsVisible(): boolean {
      return this.tableName.length > 0
    }
  },
  watch: {
    tableName() {
      (this.fields as  SchemaItemField[]) = getAllTableFieldsWithRelations(this.tableName, this.schema as SchemaItem[])
    }
  },
  beforeMount() {
    this.currentProp = this.prop;

    const tableName = getTableNameForWidget(this.widget);
    (this.fields as  SchemaItemField[]) = getAllTableFieldsWithRelations(tableName, this.schema as SchemaItem[])
  }
})
</script>

<style scoped>

</style>