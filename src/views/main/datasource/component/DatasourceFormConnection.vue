<template>
  <v-card-text class="pt-4">
    <v-text-field
        class="pl-2 pr-2"
        color="accent"
        v-model="datasourceData.name"
        :label="i18n('datasource.name')"
        :counter="30"
        :rules="nameRules"
        prepend-icon="fa-tag"
        required
    />

    <v-textarea
        class="pl-2 pr-2"
        color="accent"
        v-model="datasourceData.address"
        :label="i18n('datasource.address')"
        :rules="addressRules"
        :counter="200"
        prepend-icon="fa-globe"
        required
        auto-grow
        rows="1"
    />

    <v-text-field
        class="pl-2 pr-2"
        color="accent"
        v-model="datasourceData.secret"
        :label="i18n('datasource.secret')"
        prepend-icon="fa-key"
        type="password"
        required
        auto-grow
        rows="1"
    />
  </v-card-text>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'DatasourceFormConnection',
  props: {
    datasource: Object
  },
  data() {
    return {
      datasourceData: {},
      nameRules: [
        (v: string) => !!v || this.$t('datasource.nameRequired'),
        (v: string) => (v && v.length <= 30) || this.$t('datasource.nameTooLong'),
      ],
      addressRules: [
        (v: string) => !!v || this.$t('datasource.addressRequired')
      ]
    }
  },
  watch: {
    datasource: {
      handler() {
        this.datasourceData = this.datasource;
      },
      deep: true
    }
  },
  beforeMount() {
    this.datasourceData = this.datasource;
  }
})
</script>

<style scoped>

</style>