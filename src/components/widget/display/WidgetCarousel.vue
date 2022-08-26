<template>
  <v-carousel
      v-model="slide"
      :style="cssProps"
      :cycle="argsProps.cycle"
      :interval="interval"
      next-icon="fa-caret-right"
      prev-icon="fa-caret-left"
      :height="argsProps.height"
      hide-delimiters
      show-arrows-on-hover>

    <v-carousel-item
        v-for="(item, index) in queryData"
        :src="imgSrc(item)"
        :style="{'background-color': bgColor(item)}"
        :key="index">

      <v-row class="fill-height" justify="center" :style="{'color': textColor(item)}">
        <v-col cols="12" class="mt-auto mb-auto">
          <span class="text-h2">{{ title(item) }}</span>
          <br/><br/>
          <span class="text-h5">{{ description(item) }}</span>
        </v-col>
      </v-row>

    </v-carousel-item>

  </v-carousel>
</template>

<script lang="ts">
import Vue from "vue";
import {AppWidget, Query} from "@/lib/types";
import {getArgsProps, getCssProps, getDataProps} from "@/lib/widget";
import {GET_QUERY_BY_ID} from "@/graphql/queries/query";
import * as graphql_gen from "@/lib/graphql_gen";

export default Vue.extend({
  name: 'WidgetCarousel',
  props: {
    widget: Object,
    theme: Object,
    datasource: Object
  },
  data() {
    return {
      slide: 0,
      query: {},
      queryData: []
    }
  },
  computed: {
    appWidget(): AppWidget {
      return this.widget as AppWidget
    },
    cssProps(): ({ [p: string]: string })[] {
      return getCssProps(this.appWidget, this.theme)
    },
    argsProps(): { [k: string]: string } {
      return getArgsProps(this.appWidget)
    },
    dataProps(): { [k: string]: string } {
      return getDataProps(this.appWidget)
    },
    interval(): number {
      return Number(this.argsProps.interval)
    },
    graphQLQuery(): string {
      const query = (this.query as Query)

      if (!query.name) {
        return ''
      }

      const where = graphql_gen.mapModelStringToQueryWhereArray(query.where ?? '')
      const orderBy = graphql_gen.mapModelStringToQueryOrderByArray(query.order_by ?? '')
      const vars = graphql_gen.mapModelStringToQueryVariableArray(query.variables ?? '')

      return graphql_gen.generateGraphQLQuery(
          query.name,
          query.table,
          query.fields,
          where,
          orderBy,
          query.limit,
          vars
      )
    }
  },
  methods: {
    title(item: never): string {
      return item ? item[this.dataProps.titleQueryVarId] : ''
    },
    description(item: never): string {
      return item ? item[this.dataProps.descriptionQueryVarId] : ''
    },
    imgSrc(item: never): string {
      return item ? item[this.dataProps.imgQueryVarId] : ''
    },
    bgColor(item: never): string {
      return item ? item[this.dataProps.bgColorQueryVarId] : ''
    },
    textColor(item: never): string {
      return item ? item[this.dataProps.textColorQueryVarId] : ''
    }
  },
  apollo: {
    QUERY: {
      query: GET_QUERY_BY_ID,
      fetchPolicy: 'no-cache',
      variables(): { id: number } {
        return {
          id: this.dataProps.queryId
        }
      },
      skip(): boolean {
        return !this.dataProps.queryId || !this.datasource
      },
      result({data}): void {
        this.query = data.QUERY[0]

        graphql_gen.runQuery(
            this.datasource.address,
            this.graphQLQuery,
            (this.query as Query).table,
            this.datasource.secret,
            (this.query as Query).variables
        ).then((result) => {
          (this.queryData as unknown[]) = result.data
        })
      }
    }
  }
})
</script>

<style scoped>

</style>