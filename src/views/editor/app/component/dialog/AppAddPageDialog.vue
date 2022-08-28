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

          <div class="pt-4 text-body-1">{{ i18n('editor.pageParams') }}</div>

          <v-text-field
              class="pt-1"
              v-for="(param, index) in params"
              :key="index"
              color="accent"
              :value="param"
              :counter="30"
              :rules="pageParamRules"
              dense
              @change="(val) => params[index] = val">

            <template v-slot:append>
              <v-btn
                  class="ma-1"
                  fab depressed
                  height="24"
                  width="24"
                  color="transparent"
                  @click="params.splice(index, 1)">
                <v-icon x-small>fa-times</v-icon>
              </v-btn>
            </template>
          </v-text-field>

          <div>
            <IconButton
                class="mt-2"
                :label="i18n('editor.addPageParam')"
                icon="fa-plus"
                color="info"
                @click="params.push('')">
            </IconButton>
          </div>
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
      params: [],
      pageNameRules: [
        (v: string) => !!v || this.$t('editor.pageNameRequired'),
        (v: string) => (v && v.length <= 30) || this.$t('editor.pageNameTooLong'),
      ],
      pageParamRules: [
        (v: string) => !!v || this.$t('editor.paramNameRequired'),
        (v: string) => (v && v.length <= 30) || this.$t('editor.paramNameTooLong'),
        (v: string) => (v && !/[^a-zA-Z0-9]/.test(v)) || this.$t('editor.valueNoSpecialChars')
      ]
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
          name: this.pageName,
          params: this.params.join(';')
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