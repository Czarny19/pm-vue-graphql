<template>
  <div>
    <v-select
        v-if="prop.field"
        class="pt-3"
        color="accent"
        outlined dense hide-details
        :label="i18n('editor.conditionOperator')"
        :items="conditions"
        v-model="currentProp.condition"
        item-color="accent">
    </v-select>

    <v-select
        v-if="type === 'bool'"
        class="pt-3"
        color="accent"
        outlined dense hide-details
        :label="i18n('editor.conditionValue')"
        :items="[{id: true, name: i18n('common.yes')}, {id: false, name: i18n('common.no')}]"
        v-model="currentProp.value"
        item-text="name"
        item-value="id"
        item-color="accent">
    </v-select>

    <v-text-field
        v-if="type === 'string'"
        class="pt-3"
        color="accent"
        outlined dense hide-details
        :label="i18n('editor.conditionValue')"
        v-model="currentProp.value">
    </v-text-field>

    <v-text-field
        v-if="type === 'number'"
        class="pt-3"
        color="accent"
        outlined dense hide-details
        :label="i18n('editor.conditionValue')"
        v-model="currentProp.value"
        @keydown="onKeydown">
    </v-text-field>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {ConditionProp, SchemaItemField} from "@/lib/types";
import * as widget from "@/lib/widget";
import {filterNumbersOnly} from "@/lib/filters";

export default Vue.extend({
  name: 'GuiEditorConditionValue',
  props: {
    prop: Object,
    widget: Object,
    schema: Array,
    fields: Array
  },
  data() {
    return {
      currentProp: {}
    }
  },
  computed: {
    condition(): ConditionProp {
      return this.prop as ConditionProp
    },
    type(): string {
      const field = (this.fields as SchemaItemField[]).find((field) => field.name === this.condition.field)

      if (field) {
        switch (field.type) {
          case 'String':
          case 'date':
          case 'time':
            return 'string'
          case 'Int':
          case 'float8':
          case 'bigint':
            return 'number'
          case 'Boolean':
            return 'bool'
          default:
            return 'string'
        }
      }

      return 'string'
    },
    conditions(): string[] {
      switch (this.type) {
        case 'string':
          return widget.stringCondTypes
        case 'number':
          return widget.numCondTypes
        case 'bool':
          return widget.boolCondTypes
        default:
          return widget.stringCondTypes
      }
    }
  },
  methods: {
    onKeydown(event: KeyboardEvent) {
      filterNumbersOnly(event)
    }
  },

  beforeMount() {
    this.currentProp = this.prop
  }
})
</script>

<style scoped>

</style>