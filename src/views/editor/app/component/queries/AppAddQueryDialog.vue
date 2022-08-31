<template>
  <v-dialog persistent v-model="isOpen" max-width="800">
    <v-card>
      <v-card-title class="text-start">{{ i18n('editor.addQuery') }}</v-card-title>

      <v-card-text class="text-start pt-2 pb-2">
        <v-form v-model="valid" ref="form" @submit.prevent="save">
          <v-text-field
              class="pa-2"
              color="accent"
              v-model="queryName"
              :label="i18n('editor.queryName')"
              :counter="50"
              :rules="queryNameRules"
              prepend-icon="fa-tag"
              required>
          </v-text-field>

          <v-select
              class="pa-2"
              color="accent"
              item-color="accent"
              v-model="queryTable"
              :items="['', ...tables]"
              :label="i18n('editor.tableName')"
              :rules="queryTableRules"
              required
              append-icon="fa-chevron-down"
              prepend-icon="fa-table"
              item-text="name"
              item-value="id">
          </v-select>
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-6">
        <IconButton :label="i18n('common.cancel')" icon="fa-times" color="error" @click="close"/>
        <v-spacer></v-spacer>
        <IconButton :label="i18n('common.save')" icon="fa-save" color="success" @click="save"/>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import IconButton from "@/components/button/IconButton.vue";
import {ADD_QUERY} from "@/graphql/queries/query";

export default Vue.extend({
  name: 'AppAddQueryDialog',
  components: {IconButton},
  props: {
    dialog: Boolean,
    datasourceId: Number,
    tables: Array
  },
  data() {
    return {
      isOpen: false,
      valid: false,
      queryName: '',
      queryTable: '',
      queryNameRules: [
        (v: string) => !!v || this.$t('editor.queryNameRequired'),
        (v: string) => (v && v.length <= 50) || this.$t('editor.queryNameTooLong'),
      ],
      queryTableRules: [
        (v: string) => !!v || this.$t('editor.tableRequired')
      ]
    }
  },
  methods: {
    save(): void {
      (this.$refs.form as Vue & { validate: () => boolean }).validate()

      if (this.valid) {
        this.addQuery()
      }
    },
    addQuery(): void {
      this.$apollo.mutate({
        mutation: ADD_QUERY,
        variables: {
          datasourceId: this.datasourceId,
          name: this.queryName,
          table: this.queryTable,
        }
      }).then(async () => {
        this.queryName = ''
        this.queryTable = ''
        this.isOpen = false
        this.$emit('refresh')
        this.$emit('close')
      }).catch(() => {
        this.queryName = ''
        this.queryTable = ''
        this.isOpen = false
        this.$emit('close')
      })
    },
    close() {
      this.$emit('close')
    }
  },
  watch: {
    dialog(): void {
      this.isOpen = this.dialog
    }
  }
})
</script>

<style scoped>

</style>