<template>
  <v-select
      v-if="relationsVisible"
      class="pt-3"
      color="accent"
      outlined dense hide-details
      :label="prop.label"
      :items="['', ...relationships]"
      v-model="currentProp.value"
      item-value="id"
      item-text="name"
      item-color="accent">
  </v-select>
</template>

<script lang="ts">
import Vue from "vue";
import {SchemaItem, SchemaItemField} from "@/lib/types";
import {getTableArrayRelations} from "@/lib/schema";
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
      relationships: []
    }
  },
  computed: {
    tableName(): string {
      return getTableNameForWidget(this.widget)
    },
    relationsVisible(): boolean {
      return this.tableName.length > 0
    }
  },
  watch: {
    tableName(): void {
      (this.relationships as SchemaItemField[]) = getTableArrayRelations(this.tableName, this.schema as SchemaItem[])
    }
  },
  beforeMount() {
    this.currentProp = this.prop;

    const tableName = getTableNameForWidget(this.widget);
    (this.relationships as SchemaItemField[]) = getTableArrayRelations(tableName, this.schema as SchemaItem[])
  }
})
</script>

<style scoped>

</style>