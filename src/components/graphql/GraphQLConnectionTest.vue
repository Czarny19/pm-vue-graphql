<template>
  <v-container fluid>
    <v-row class="text-start">
      <v-col class="text-body-2 text-start mt-auto mb-auto" cols="auto">
        <v-icon :color="connectionStatusColor" size="24" class="pr-4 mb-1">fa-circle</v-icon>
        {{ i18n('datasource.connectionStatus') }}: {{ connectionStatusDesc }}
      </v-col>
      <v-col v-if="!isAuto" class="text-end pr-2" cols="auto">
        <v-btn small class="pa-4" color="info" @click="checkConnection" :disabled="!address">
          {{ i18n('datasource.checkConnection') }}
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-if="errorMsg" no-gutters class="text-start ml-0 pl-0 pt-4">
      <div class="text-body-2 mt-2 mb-2 pl-4 pr-4 pb-2 pt-2 error-chip">{{ errorMsg }}</div>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {getCleanGraphQLSchema} from "@/lib/schema";
import {SchemaItem} from "@/lib/types";

export default Vue.extend({
  name: 'GraphQLConnectionTest',
  props: {
    address: String,
    secret: String,
    isAuto: Boolean
  },
  data() {
    return {
      connectionStatusDesc: '',
      connectionStatusColor: '',
      errorMsg: '',
      schema: []
    }
  },
  methods: {
    async checkConnection(): Promise<void> {
      const result = await getCleanGraphQLSchema(this.address, this.secret);
      (this.schema as SchemaItem[]) = result.schema;
      this.errorMsg = result.errorMsg.toString();

      if (this.errorMsg.length) {
        this.connectionStatusColor = 'error';
        this.connectionStatusDesc = this.$t('datasource.statusError').toString();
        this.$emit('error');
        return
      } else {
        this.connectionStatusColor = 'success';
        this.connectionStatusDesc = this.$t('datasource.statusSuccess').toString();
        this.$emit('setschema', this.schema);
      }
    }
  },
  watch: {
    address(): void {
      this.connectionStatusDesc = this.$t('datasource.statusNone').toString();
      this.connectionStatusColor = 'grey';
      this.errorMsg = '';

      if (this.isAuto) {
        this.checkConnection();
      }
    }
  },
  async beforeMount() {
    this.connectionStatusDesc = this.$t('datasource.statusNone').toString();
    this.connectionStatusColor = 'grey';

    if (this.isAuto) {
      await this.checkConnection();
    }
  }
})
</script>

<style scoped>

</style>