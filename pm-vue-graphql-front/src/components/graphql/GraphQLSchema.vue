<template>
  <v-card v-if="!schema.length" color="primary" class="pa-2">
    <CardSectionTitle class="mt-4" :title="i18n('datasource.schema')"/>

    <v-card-text class="text-body-2 pt-4">
      {{ i18n('datasource.noSchema') }}
    </v-card-text>
  </v-card>

  <v-card v-else color="primary" class="pa-2">
    <CardSectionTitle class="mt-4" :title="i18n('datasource.schema')"/>

    <v-expansion-panels class="pa-3">
      <v-expansion-panel v-for="schemaItem in cleanSchema" :key="schemaItem.name">

        <v-expansion-panel-header class="primary text-start text-body-2" expand-icon="fa-angle-down" ripple>
          {{ schemaItem.name }}
        </v-expansion-panel-header>

        <v-expansion-panel-content class="pt-4">
          <div class="text-start text-body-2 pa-2 pb-4">{{ schemaItem.description }}</div>

          <v-data-table
              :headers="fieldHeaders"
              :items="schemaItem.fields"
              hide-default-footer
              dense
              disable-sort
              class="elevation-0">
          </v-data-table>
        </v-expansion-panel-content>

      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import {SchemaItem} from "@/plugins/types";
import CardSectionTitle from "@/components/card/CardSectionTitle.vue";

export default Vue.extend({
  name: 'GraphQLSchema',
  components: {CardSectionTitle},
  props: {
    schema: Array,
  },
  computed: {
    ignoredObjects(): string [] {
      return [
        '_aggregate', '_aggregate_fields', '_avg_fields', '_max_fields', '_min_fields', '_mutation_response',
        '_stddev_fields', '_stddev_pop_fields', '_stddev_samp_fields', '_sum_fields', '_var_pop_fields',
        '_var_samp_fields', '_variance_fields', '__Directive', '__EnumValue', '__Field', '__InputValue',
        '_Schema', '__Type', 'mutation_root', 'query_root', 'subscription_root'
      ]
    },
    fieldHeaders(): { text: string; value: string }[] {
      return [
        {text: this.$t('datasource.fieldName').toString(), value: 'name'},
        {text: this.$t('datasource.fieldType').toString(), value: 'type.ofType.name'}
      ]
    },
    cleanSchema(): SchemaItem [] {
      const cleanSchema: SchemaItem [] = [];

      this.schema.forEach(item => {
        const schemaItem = (item as SchemaItem)

        const isObject = schemaItem.kind === 'OBJECT';
        const hasFields = schemaItem.fields;
        const nameNotIgnored = this.ignoredObjects.filter(ignored => schemaItem.name.endsWith(ignored)).length == 0

        if (isObject && hasFields && nameNotIgnored) {
          schemaItem.fields.forEach(field => {
            if (field.type && !field.type.ofType) {
              field.type.ofType = {name: 'nullable'}
            }

            const typeName = field.type.ofType.name
            field.type.ofType.name = typeName.charAt(0).toUpperCase() + typeName.slice(1);
          })

          cleanSchema.push(schemaItem)
        }
      })

      return cleanSchema;
    }
  },
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    }
  }
})
</script>

<style scoped>

</style>