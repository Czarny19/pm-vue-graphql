<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="12" sm="12" md="8" lg="8" xl="8" class="pa-2">
        <v-card color="primary" class="pa-2 pb-6">
          <LoadingCircular v-if="loading"/>

          <template v-else>
            <v-form v-model="valid" ref="form" @submit.prevent="submit">

              <CardSectionTitle class="mt-4" :title="i18n('editor.query')"/>
              <QueryInfo :query="currentQuery" :tables-names="tablesNames"/>

              <CardSectionTitle
                  class="mt-2"
                  :title="i18n('editor.fields')"
                  show-hide-button
                  :is-hidden="fieldsHidden"
                  @showhideclick="fieldsHidden = !fieldsHidden">
              </CardSectionTitle>
              <QueryFields
                  v-if="fieldsVisible && !fieldsHidden"
                  :query="currentQuery"
                  :current-table="currentTable"
                  :tables-names="tablesNames">
              </QueryFields>

              <CardSectionTitle
                  class="mt-2"
                  :title="i18n('editor.sorting')"
                  show-hide-button
                  :is-hidden="sortHidden"
                  @showhideclick="sortHidden = !sortHidden">
              </CardSectionTitle>
              <QueryOrderByBuilder
                  v-if="!sortHidden"
                  :query="currentQuery"
                  :field-names="currentTableFields">
              </QueryOrderByBuilder>

              <CardSectionTitle
                  class="mt-2"
                  :title="i18n('editor.variables')"
                  show-hide-button
                  :is-hidden="propsHidden"
                  @showhideclick="propsHidden = !propsHidden">
              </CardSectionTitle>
              <QueryVariables v-if="!propsHidden" :query="currentQuery"/>

              <CardSectionTitle
                  class="mt-2"
                  :title="i18n('editor.restrictions')"
                  show-hide-button
                  :is-hidden="whereHidden"
                  @showhideclick="whereHidden = !whereHidden">
              </CardSectionTitle>
              <QueryWhereBuilder v-if="!whereHidden" :query="currentQuery" :fields="currentTable.fields"/>

            </v-form>
          </template>
        </v-card>
      </v-col>

      <v-col cols="12" sm="12" md="4" lg="4" xl="4" class="pa-2">
        <QueryPreview
            :table="currentQuery.table"
            :fields="currentQuery.fields"
            :graphql-query="graphQLQuery"
            :graphql-variables="currentQuery.variables"
            :datasource-address="datasourceAddress"
            :datasource-secret="datasourceSecret">
        </QueryPreview>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import LoadingCircular from "@/components/loading/LoadingCircular.vue";
import CardSectionTitle from "@/components/card/CardSectionTitle.vue";
import QueryPreview from "@/views/editor/query/component/QueryPreview.vue";
import QueryWhereBuilder from "@/views/editor/query/component/form/QueryWhereBuilder.vue";
import QueryOrderByBuilder from "@/views/editor/query/component/form/QueryOrderByBuilder.vue";
import QueryInfo from "@/views/editor/query/component/form/QueryInfo.vue";
import QueryFields from "@/views/editor/query/component/form/QueryFields.vue";
import QueryVariables from "@/views/editor/query/component/form/QueryVariables.vue";
import {UPDATE_QUERY_BY_ID} from "@/graphql/queries/query";
import {Query, SchemaItem} from "@/plugins/types";
import {generateQuery, generateVariablesPreview} from "@/plugins/query";

export default Vue.extend({
  name: 'QueryForm',
  components: {
    QueryVariables,
    QueryFields,
    QueryInfo,
    QueryOrderByBuilder,
    QueryWhereBuilder,
    QueryPreview,
    CardSectionTitle,
    LoadingCircular
  },
  props: {
    query: Object,
    datasourceAddress: String,
    datasourceSecret: String,
    tables: Array,
    tablesNames: Array,
    loading: Boolean
  },
  data() {
    return {
      valid: false,
      currentQuery: {},
      fieldsHidden: true,
      sortHidden: true,
      propsHidden: true,
      whereHidden: true
    }
  },
  computed: {
    graphQLQuery(): string {
      const query = (this.currentQuery as Query)
      return generateQuery(
          query.name,
          query.table,
          query.fields,
          query.where,
          query.order_by,
          query.limit,
          query.variables
      )
    },
    graphQLVariablesPreview(): string {
      const query = (this.currentQuery as Query)
      return generateVariablesPreview(query.variables ?? [])
    },
    currentTable(): SchemaItem {
      return (this.tables as SchemaItem[]).filter(table => table.name === (this.currentQuery as Query).table)[0]
    },
    currentTableFields(): string [] {
      if (!this.currentTable) {
        return []
      }

      return this.currentTable.fields.map((field) => (field as { name: string }).name)
    },
    fieldsVisible(): boolean {
      return (this.currentQuery as Query).table.length > 0
    }
  },
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    },
    submit(): void {
      (this.$refs.form as Vue & { validate: () => boolean }).validate()

      if (this.valid) {
        this.$emit('saving', true)
        this.updateQuery()
      }
    },
    // cancel(): void {
    //   this.$router.back()
    // },
    // setTheme(): void {
    //   this.theme = this.themes.filter((theme: Theme) => theme.id === Number(this.themeId))[0]
    //   this.themeSet = true
    // },
    // clearTheme(): void {
    //   this.theme = {}
    //   this.themeSet = false
    //   this.themeId = null
    // },
    // setDataSource(): void {
    //   const dataSource: DataSource = this.dataSources.filter((ds: DataSource) => ds.id === Number(this.dataSourceId))[0]
    //   this.dataSourceAddress = dataSource.address
    //   this.dataSourceSecret = CryptoJS.AES.decrypt(dataSource.secret ?? '', cryptoKey).toString(CryptoJS.enc.Utf8)
    //   this.dataSourceSet = true
    // },
    // clearDatasource(): void {
    //   this.dataSourceId = null
    //   this.dataSourceSet = false
    //   this.dataSourceAddress = ''
    //   this.dataSourceSecret = ''
    // },
    updateQuery(): void {
      this.$apollo.mutate({
        mutation: UPDATE_QUERY_BY_ID,
        variables: {
          id: (this.currentQuery as Query).id,
          name: (this.currentQuery as Query).name,
          table: (this.currentQuery as Query).table,
          limit: (this.currentQuery as Query).limit,
          orderBy: (this.currentQuery as Query).order_by,
          where: (this.currentQuery as Query).where,
          fields: (this.currentQuery as Query).fields
        }
      }).then(() => {
        this.$emit('saving', false)
        this.$router.back()
      }).catch(() => {
        this.$emit('saving', false)
      })
    }
  },
  watch: {
    query: {
      handler() {
        this.currentQuery = this.query

        if ((this.currentQuery as Query).variables == undefined) {
          (this.currentQuery as Query).variables = []
        }
      },
      deep: true
    }
  },
  beforeMount() {
    this.currentQuery = this.query

    if ((this.currentQuery as Query).variables == undefined) {
      (this.currentQuery as Query).variables = []
    }
  }
})
</script>

<style scoped>

</style>