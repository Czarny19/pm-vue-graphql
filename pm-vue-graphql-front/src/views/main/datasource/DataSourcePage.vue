<template>
  <v-container fluid>
    <LoadingDialog :dialog="saving" :title="i18n('datasource.saving')"/>

    <v-row class="mt-2 ml-2 mr-2">
      <v-col>
        <TitleCard :title="i18n('datasource.datasource')" icon="fa-database"/>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col>
        <DataSourceForm :data-source-id="dataSourceId" @saving="setSaving" @setschema="setSchema"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import DataSourceForm from "@/views/main/datasource/component/DataSourceForm.vue";
import LoadingDialog from "@/components/dialog/LoadingDialog.vue";
import TitleCard from "@/components/card/TitleCard.vue";

export default Vue.extend({
  name: 'DataSourcePage',
  components: {TitleCard, LoadingDialog, DataSourceForm},
  data() {
    return {
      saving: false,
      schema: []
    }
  },
  computed: {
    dataSourceId(): number {
      return Number(this.$route.params.dataSourceId)
    }
  },
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    },
    setSaving(saving: boolean): void {
      this.saving = saving
    },
    setSchema(schema: []) {
      this.schema = schema
    }
  }
})
</script>

<style scoped>

</style>