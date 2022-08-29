<template>
  <v-card-text class="pa-3 pt-0 pb-6">
    <div class="elevation-6 pt-4">
      <v-container fluid class="pa-4">
        <v-row v-for="(orderBy, index) in orderByList" :key="index">
          <v-col cols="8">
            <v-select
                class="pa-0"
                color="accent"
                item-color="accent"
                v-model="orderBy.field"
                :items="fieldsNames"
                :label="i18n('editor.field')"
                required
                append-icon="fa-chevron-down">
            </v-select>
          </v-col>

          <v-col cols="2" class="text-start">
            <IconButton
                v-if="orderBy.isAsc"
                :label="i18n('editor.sortAsc')"
                color="info"
                icon="fa-arrow-up"
                @click="setOrderByAsc(orderBy)">
            </IconButton>

            <IconButton
                v-else
                :label="i18n('editor.sortDesc')"
                color="info"
                icon="fa-arrow-down"
                @click="setOrderByAsc(orderBy)">
            </IconButton>
          </v-col>

          <v-spacer></v-spacer>

          <v-col cols="1" class="text-end">
            <v-btn fab x-small color="error" @click="deleteOrderBy(orderBy)">
              <v-icon small>fa-times</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-row>
          <v-col class="text-start">
            <IconButton :label="i18n('editor.addSort')" color="success" icon="fa-plus" @click="addOrderBy"/>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-card-text>
</template>

<script lang="ts">
import Vue from "vue";
import IconButton from "@/components/button/IconButton.vue";
import {Query, QueryOrderBy, SchemaItemField} from "@/lib/types";
import {mapModelStringToQueryOrderByArray} from "@/lib/graphql_gen";

export default Vue.extend({
  name: 'QueryOrderByBuilder',
  components: {IconButton},
  props: {
    query: Object,
    fields: Array
  },
  data() {
    return {
      currentQuery: {},
      orderByFields: []
    }
  },
  computed: {
    orderByList(): QueryOrderBy [] {
      return this.orderByFields as QueryOrderBy []
    },
    fieldsNames(): string[] {
      return (this.fields as SchemaItemField[]).map((field) => field.name)
    }
  },
  methods: {
    addOrderBy(): void {
      this.orderByList.push({field: '', isAsc: true})
    },
    setOrderByAsc(orderBy: QueryOrderBy): void {
      orderBy.isAsc = !orderBy.isAsc
    },
    deleteOrderBy(orderBy: QueryOrderBy): void {
      this.orderByFields.forEach((orderByField, index) => {
        if (orderByField == orderBy) {
          this.orderByFields.splice(index, 1)
        }
      })
    }
  },
  watch: {
    orderByFields: {
      handler() {
        const query = (this.currentQuery as Query)
        query.order_by = this.orderByList.map(orderBy => (JSON.stringify(orderBy))).join(';')
      },
      deep: true
    }
  },
  beforeMount() {
    (this.orderByFields as QueryOrderBy[]) = mapModelStringToQueryOrderByArray((this.query as Query).order_by ?? '')
    this.currentQuery = this.query;
  }
})
</script>

<style scoped>

</style>