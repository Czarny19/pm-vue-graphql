<template>
  <v-dialog persistent v-model="isOpen" max-width="800">
    <v-card>
      <v-card-title class="text-start">{{ i18n('canvas.addPage') }}</v-card-title>

      <v-card-text class="text-start pt-2 pb-2">
        <v-form v-model="valid" ref="form" @submit.prevent="save">
          <v-text-field
              class="pa-4"
              color="accent"
              v-model="pageName"
              :label="i18n('canvas.pageName')"
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
import {ADD_PAGE_FOR_PROJECT} from "@/graphql/queries/page";

export default Vue.extend({
  name: 'CanvasMenuAddPageDialog',
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
        (v: string) => !!v || this.$t('canvas.pageNameRequired'),
        (v: string) => (v && v.length <= 30) || this.$t('canvas.pageNameTooLong'),
      ],
    }
  },
  watch: {
    dialog(): void {
      this.isOpen = this.dialog
    }
  },
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    },
    save(): void {
      (this.$refs.form as Vue & { validate: () => boolean }).validate()

      if (this.valid) {
        this.addPage()
      }
    },
    addPage(): void {
      this.$apollo.mutate({
        mutation: ADD_PAGE_FOR_PROJECT,
        variables: {
          projectId: this.projectId,
          name: this.pageName,
        }
      }).then(async () => {
        this.isOpen = false
        this.$emit('refresh')
        this.$emit('close')
      }).catch(() => {
        this.isOpen = false
        this.$emit('close')
      })
    },
    close() {
      this.$emit('close')
    }
  }
})
</script>

<style scoped>

</style>