<template>
  <v-dialog persistent v-model="isOpen" max-width="800">
    <v-card>
      <v-card-title class="text-start">{{ i18n('editor.addVariable') }}</v-card-title>

      <v-card-text class="text-start pt-2 pb-2">
        <v-form v-model="valid" ref="form" @submit.prevent="save">
          <v-text-field
              class="pa-2"
              color="accent"
              v-model="propName"
              :label="i18n('editor.propName')"
              :counter="30"
              :rules="propNameRules"
              prepend-icon="fa-tag"
              required
          />

          <v-select
              class="pa-2"
              color="accent"
              :label="i18n('editor.propType')"
              :items="['', ...types]"
              v-model="propType"
              :rules="propTypeRules"
              item-value="id"
              item-text="name"
              item-color="accent"
              prepend-icon="fa-keyboard"
          />

          <v-text-field
              class="pa-2"
              color="accent"
              v-model="propValue"
              :label="i18n('editor.propValue')"
              prepend-icon="fa-pen-clip"
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
import {ADD_PROP} from "@/graphql/queries/prop";

export default Vue.extend({
  name: 'GuiEditorAddPropDialog',
  components: {IconButton},
  props: {
    dialog: Boolean
  },
  data() {
    return {
      isOpen: false,
      valid: false,
      propName: '',
      propType: '',
      propValue: '',
      propNameRules: [
        (v: string) => !!v || this.$t('editor.propNameRequired'),
        (v: string) => (v && v.length <= 30) || this.$t('editor.propNameTooLong'),
        (v: string) => (v && !/[^a-zA-Z0-9]/.test(v)) || this.$t('editor.propNameNoSpecialChars')
      ],
      propTypeRules: [
        (v: string) => !!v || this.$t('editor.propTypeRequired'),
      ]
    }
  },
  computed: {
    pageId(): number {
      return Number(this.$route.params.pageId);
    },
    types(): { id: string; name: string }[] {
      return [
        {id: 'String', name: this.$t('editor.propString').toString()},
        {id: 'number', name: this.$t('editor.propNumber').toString()}
      ];
    }
  },
  methods: {
    save(): void {
      (this.$refs.form as Vue & { validate: () => boolean }).validate();

      if (this.valid) {
        this.addProp();
      }
    },
    addProp(): void {
      this.$apollo.mutate({
        mutation: ADD_PROP,
        variables: {
          pageId: this.pageId,
          name: this.propName,
          type: this.propType,
          type_display: this.types.find((type) => type.id === this.propType)?.name ?? '',
          value: this.propValue
        }
      }).then(async () => {
        this.propName = '';
        this.propType = '';
        this.propValue = '';
        this.isOpen = false;
        this.$emit('refresh');
        this.$emit('close');
      }).catch(() => {
        this.propName = '';
        this.propType = '';
        this.propValue = '';
        this.isOpen = false;
        this.$emit('close');
      })
    },
    close() {
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