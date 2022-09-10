<template>
  <v-dialog persistent v-model="isOpen" max-width="800">
    <v-card>
      <v-card-title class="text-start">{{ i18n('editor.addQuery') }}</v-card-title>

      <v-card-text class="text-start pt-2 pb-2">
        <v-form v-model="valid" ref="form" @submit.prevent="save">
          <v-text-field
              class="pa-2"
              color="accent"
              v-model="mutationName"
              :label="i18n('editor.mutationName')"
              :counter="50"
              :rules="mutationNameRules"
              prepend-icon="fa-tag"
              required
          />

          <v-select
              class="pa-2"
              color="accent"
              item-color="accent"
              v-model="mutationTable"
              :items="['', ...tables]"
              :label="i18n('editor.tableName')"
              :rules="mutationTableRules"
              required
              append-icon="fa-chevron-down"
              prepend-icon="fa-table"
              item-text="name"
              item-value="id"
          />

          <v-select
              class="pa-2"
              color="accent"
              item-color="accent"
              v-model="mutationType"
              :items="['', ...types]"
              :label="i18n('editor.mutationType')"
              :rules="mutationTypeRules"
              required
              append-icon="fa-chevron-down"
              prepend-icon="fa-table"
              item-text="name"
              item-value="id"
          />
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
import {ADD_MUTATION} from "@/graphql/queries/mutation";
import {mutationType} from "@/lib/graphql_gen";

export default Vue.extend({
  name: 'AppAddMutationDialog',
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
      mutationName: '',
      mutationTable: '',
      mutationType: '',
      mutationNameRules: [
        (v: string) => !!v || this.$t('editor.mutationNameRequired'),
        (v: string) => (v && v.length <= 50) || this.$t('editor.mutationNameTooLong'),
      ],
      mutationTableRules: [
        (v: string) => !!v || this.$t('editor.tableRequired')
      ],
      mutationTypeRules: [
        (v: string) => !!v || this.$t('editor.mutationTypeRequired')
      ]
    }
  },
  computed: {
    types(): { id: string, name: string }[] {
      return [
        {id: mutationType.Create, name: this.$t('editor.mutationInsert').toString()},
        {id: mutationType.Update, name: this.$t('editor.mutationUpdate').toString()},
        {id: mutationType.Delete, name: this.$t('editor.mutationDelete').toString()}
      ];
    }
  },
  methods: {
    save(): void {
      (this.$refs.form as Vue & { validate: () => boolean }).validate();

      if (this.valid) {
        this.addMutation();
      }
    },
    addMutation(): void {
      this.$apollo.mutate({
        mutation: ADD_MUTATION,
        variables: {
          datasourceId: this.datasourceId,
          name: this.mutationName,
          table: this.mutationTable,
          type: this.mutationType
        }
      }).then(async () => {
        this.mutationName = '';
        this.mutationTable = '';
        this.mutationType = '';
        this.isOpen = false;
        this.$emit('refresh');
        this.$emit('close');
      }).catch(() => {
        this.mutationName = '';
        this.mutationTable = '';
        this.mutationType = '';
        this.isOpen = false;
        this.$emit('close');
      })
    },
    close(): void {
      this.$emit('close');
    }
  },
  watch: {
    dialog(): void {
      this.isOpen = this.dialog;
    }
  }
})
</script>

<style scoped>

</style>