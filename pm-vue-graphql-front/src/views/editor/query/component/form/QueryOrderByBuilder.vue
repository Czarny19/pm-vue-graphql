<template>
  <v-card-text class="pa-3 pt-0 pb-6">
    <div class="elevation-6 pt-6 pb-2">
      <v-container class="pa-2 pl-4 pr-4">
        <v-row v-for="(orderBy, index) in orderByList" :key="index">
          <v-col cols="8">
            <v-select
                class="pa-0"
                color="accent"
                item-color="accent"
                v-model="orderBy.field"
                :items="fields"
                :label="i18n('editor.field')"
                required
                append-icon="fa-chevron-down">
            </v-select>
          </v-col>

          <v-col cols="2" class="text-start">
            <v-btn v-if="orderBy.isAsc" block color="info" @click="setOrderByAsc(orderBy)">
              {{ i18n('editor.sortAsc') }}
            </v-btn>

            <v-btn v-else block color="info" @click="setOrderByAsc(orderBy)">
              {{ i18n('editor.sortDesc') }}
            </v-btn>
          </v-col>

          <v-col cols="1"></v-col>

          <v-col cols="1" class="text-end">
            <v-btn block color="error" @click="deleteOrderBy(orderBy)">
              <v-icon>fa-times</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-row>
          <v-col class="text-start">
            <v-btn color="success" @click="addOrderBy()">{{ i18n('editor.addSort') }}</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-card-text>
</template>

<script lang="ts">
import Vue from "vue";
import {Query, QueryOrderBy} from "@/plugins/types";

export default Vue.extend({
  name: 'QueryOrderByBuilder',
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
    }
  },
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    },
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
    query() {
      this.currentQuery = this.query
    },
    orderByFields: {
      handler() {
        const query = (this.currentQuery as Query)
        const orderBy = this.orderByList.map(orderBy => `${orderBy.field}: ${orderBy.isAsc ? 'asc' : 'desc'}`)
        query.order_by = orderBy.join(', ')
      },
      deep: true
    }
  },
  beforeMount() {
    this.currentQuery = this.query
  }
})
</script>

<style scoped>

</style>