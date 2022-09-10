<template>
  <v-expansion-panels>
    <v-expansion-panel v-for="schemaItem in schema" :key="schemaItem.name">

      <v-expansion-panel-header class="secondary text-start" expand-icon="fa-angle-down">
        {{ schemaItem.description ? schemaItem.description : schemaItem.name }} ({{ schemaItem.name }})
      </v-expansion-panel-header>

      <v-expansion-panel-content class="primary">
        <v-data-table
            :headers="headers"
            :items="schemaItem.fields"
            disable-pagination
            hide-default-footer
            dense
            disable-sort
            class="elevation-0 primary pa-2"
        >
          <template v-slot:[`item.isNullable`]="{item}">
            <v-simple-checkbox
                dense
                :value="item.isNullable"
                on-icon="fa-check"
                off-icon="fa-times"
                class="disable-events">
            </v-simple-checkbox>
          </template>
        </v-data-table>
      </v-expansion-panel-content>

    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'GraphQLTables',
  props: {
    schema: Array
  },
  computed: {
    headers(): { text: string; value: string, width: string, align?: string }[] {
      return [
        {text: this.$t('datasource.fieldName').toString(), value: 'name', width: '50%'},
        {text: this.$t('datasource.fieldType').toString(), value: 'type', width: '20%'},
        {text: this.$t('datasource.fieldIsNullable').toString(), value: 'isNullable', width: '30%', align: 'end'}
      ];
    }
  }
})
</script>

<style scoped>

</style>