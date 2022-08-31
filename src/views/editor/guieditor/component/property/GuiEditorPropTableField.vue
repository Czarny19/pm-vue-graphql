<template>
  <div class="pb-2 pt-2">
    {{ prop.label }}

    <v-select
        class="pt-3"
        color="accent"
        outlined dense hide-details
        :label="i18n('editor.tableName')"
        :items="['', ...tablesNames]"
        v-model="currentProp.helperValue"
        item-value="id"
        item-text="name"
        item-color="accent">
    </v-select>

    <v-select
        v-if="fieldsVisible"
        class="pt-3"
        color="accent"
        outlined dense hide-details
        :label="i18n('editor.field')"
        :items="['', ...fields]"
        v-model="currentProp.value"
        item-value="id"
        item-text="name"
        item-color="accent">
    </v-select>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {SchemaItem, SchemaItemField} from "@/lib/types";
import {getAllTableFieldsWithRelations} from "@/lib/schema";

export default Vue.extend({
  name: 'GuiEditorPropTableField',
  props: {
    prop: Object,
    schema: Array
  },
  data() {
    return {
      currentProp: {},
      fields: []
    }
  },
  computed: {
    tablesNames(): string [] {
      return (this.schema as { name: string }[]).slice()?.map((table) => table.name)
    },
    tableName(): string {
      return (this.currentProp as { helperValue: string }).helperValue
    },
    fieldsVisible(): boolean {
      return this.tableName.length > 0
    }
  },
  watch: {
    tableName() {
      if (!this.tableName) {
        return
      }

      (this.fields as SchemaItemField[]) = getAllTableFieldsWithRelations(this.tableName, this.schema as SchemaItem[])
    }
  },
  beforeMount() {
    this.currentProp = this.prop
  }
})
</script>

<style scoped>

</style>