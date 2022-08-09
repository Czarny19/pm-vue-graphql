<template>
  <v-container fluid>
    <TitleCard class="ma-1 mb-3" :title="i18n('datasource.datasource')" icon="fa-database"/>
    <DatasourceInfo class="ma-1 mb-2"/>
    <DatasourceForm :loading="loading" :datasource="datasource" :user-id="currentUser.id"/>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import DatasourceForm from "@/views/main/datasource/component/DatasourceForm.vue";
import TitleCard from "@/components/card/TitleCard.vue";
import DatasourceInfo from "@/views/main/datasource/component/DatasourceInfo.vue";
import {CURRENT_USER} from "@/graphql/queries/user";
import {GET_DATA_SOURC_LIST_BY_ID} from "@/graphql/queries/datasource";
import {cryptoKey} from "@/main";
import * as CryptoJS from "crypto-js";

export default Vue.extend({
  name: 'DatasourcePage',
  components: {DatasourceInfo, TitleCard, DatasourceForm},
  data() {
    return {
      loading: true,
      currentUser: {id: -1},
      datasource: {}
    }
  },
  computed: {
    datasourceId(): number {
      return Number(this.$route.params.datasourceId)
    }
  },
  apollo: {
    currentUser: {
      query: CURRENT_USER
    },
    DATA_SOURCE: {
      query: GET_DATA_SOURC_LIST_BY_ID,
      fetchPolicy: 'no-cache',
      variables(): { id: number } {
        return {
          id: this.datasourceId
        }
      },
      skip(): boolean {
        return !this.datasourceId
      },
      result({data}): void {
        const secret = CryptoJS.AES.decrypt(data.DATA_SOURCE[0].secret ?? '', cryptoKey).toString(CryptoJS.enc.Utf8)

        this.datasource = data.DATA_SOURCE[0]
        this.datasource.secret = secret
        this.loading = false
      }
    }
  },
  beforeMount() {
    if (!this.datasourceId) {
      this.loading = false
    }
  }
})
</script>

<style scoped>

</style>