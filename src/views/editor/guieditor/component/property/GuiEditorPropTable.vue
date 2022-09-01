<template>
  <v-select
      class="pt-3"
      color="accent"
      outlined dense hide-details
      :label="i18n('editor.tableName')"
      :items="['', ...tablesNames]"
      v-model="currentProp.value"
      item-value="id"
      item-text="name"
      item-color="accent">
  </v-select>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'GuiEditorPropTable',
  props: {
    prop: Object,
    schema: Array
  },
  data() {
    return {
      currentProp: {}
    }
  },
  computed: {
    tablesNames(): string [] {
      return (this.schema as { name: string }[]).slice()?.map((table) => table.name)
    }
  },
  beforeMount() {
    this.currentProp = this.prop
  }
})
</script>

<style scoped>

</style>