<template>
  <v-dialog persistent v-model="isOpen" max-width="800">
    <v-card>
      <v-card-title class="text-start">{{ i18n('editor.addPage') }}</v-card-title>

      <v-card-text class="text-start pt-2 pb-2">
        <v-form v-model="valid" ref="form" @submit.prevent="save">
          <v-text-field
              class="pa-2"
              color="accent"
              v-model="pageName"
              :label="i18n('editor.pageName')"
              :counter="30"
              :rules="pageNameRules"
              prepend-icon="fa-tag"
              required>
          </v-text-field>
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
import {ADD_PAGE} from "@/graphql/queries/page";
import {generateInitialPageDefinition} from "@/lib/widget";

export default Vue.extend({
  name: 'AppAddPageDialog',
  components: {IconButton},
  props: {
    dialog: Boolean,
    projectId: Number
  },
  data() {
    return {
      isOpen: false,
      valid: false,
      pageName: '',
      pageNameRules: [
        (v: string) => !!v || this.$t('editor.pageNameRequired'),
        (v: string) => (v && v.length <= 30) || this.$t('editor.pageNameTooLong'),
      ],
    }
  },
  methods: {
    save(): void {
      (this.$refs.form as Vue & { validate: () => boolean }).validate()

      if (this.valid) {
        this.addPage()
      }
    },
    addPage(): void {
      this.$apollo.mutate({
        mutation: ADD_PAGE,
        variables: {
          projectId: this.projectId,
          definition: generateInitialPageDefinition(this.pageName),
          name: this.pageName
        }
      }).then(async () => {
        this.pageName = ''
        this.isOpen = false
        this.$emit('refresh')
        this.$emit('close')
      }).catch(() => {
        this.pageName = ''
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