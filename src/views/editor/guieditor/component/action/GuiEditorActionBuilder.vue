<template>
  <div>
    <div class="secondary text-start text-body-2 pa-3 pl-6">
      {{ actionsGroup.label }}
    </div>

    <v-container fluid class="pa-4">
      <div v-for="(prop, index) in actionsGroup.props" :key="index">
        <div class="text-body-1 pl-3 pr-3 pt-1 pb-1 mt-1 mb-3 editor--action-tab">
          {{ `${i18n('editor.action')}: ${index + 1}` }}
        </div>

        <v-btn class="mt-2 mb-4 ml-auto mr-2" block color="error" @click="deleteAction(prop)">
          {{ `${i18n('editor.deleteAction')}: ${index + 1}` }}
        </v-btn>

        <v-select
            class="pt-2"
            color="accent"
            outlined dense hide-details
            :label="i18n('editor.actionType')"
            :items="['', ...types]"
            v-model="prop.type"
            item-value="id"
            item-text="name"
            item-color="accent">
        </v-select>

        <v-select
            class="pt-3"
            color="accent"
            outlined dense hide-details
            :label="i18n('editor.errorMsg')"
            :items="['', ...variables]"
            v-model="prop.errorMsgVar"
            item-value="id"
            item-text="name"
            item-color="accent">
        </v-select>

        <v-switch
            class="pt-0"
            color="success"
            v-model="prop.errorMsgShowResponse"
            :label="i18n('editor.errorShowResponse')">
        </v-switch>

        <div class="text-body-1 pl-3 pr-3 pt-1 pb-1 mt-0 mb-3 editor--action-tab">
          {{ i18n('editor.actionTarget') }}
        </div>

        <template v-if="prop.type">
          <GuiEditorActionRunMutation
              class="pt-2"
              v-if="prop.type === 'runMutation'"
              :prop="prop"
              :page="page"
              :mutations="mutations"
              :widget="widget"
              :schema="schema"
              :variables="variables">
          </GuiEditorActionRunMutation>

          <GuiEditorActionGoToPage
              class="pt-2"
              v-if="prop.type === 'goToPage'"
              :prop="prop"
              :page="page"
              :pages="pages"
              :widget="widget"
              :schema="schema"
              :variables="variables">
          </GuiEditorActionGoToPage>
        </template>
      </div>

      <v-row no-gutters v-if="!actionsGroup.addLocked">
        <v-col>
          <IconButton
              class="mt-5 mb-5"
              block
              :label="i18n('editor.addAction')"
              color="success"
              icon="fa-plus"
              @click="addAction">
          </IconButton>

          <v-divider></v-divider>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import IconButton from "@/components/button/IconButton.vue";
import GuiEditorActionGoToPage from "@/views/editor/guieditor/component/action/GuiEditorActionGoToPage.vue";
import GuiEditorActionRunMutation from "@/views/editor/guieditor/component/action/GuiEditorActionRunMutation.vue";
import {ActionProp} from "@/lib/types";
import {getActionTypes} from "@/lib/widget";

export default Vue.extend({
  name: 'GuiEditorActionBuilder',
  components: {GuiEditorActionGoToPage, GuiEditorActionRunMutation, IconButton},
  props: {
    actionsGroup: Object,
    mutations: Array,
    page: Object,
    pages: Array,
    widget: Object,
    schema: Array,
    variables: Array
  },
  data() {
    return {
      actionGroupProps: []
    }
  },
  computed: {
    types(): { id: string; name: string }[] {
      return getActionTypes()
    }
  },
  methods: {
    addAction(): void {
      (this.actionGroupProps as ActionProp[]).push({
        id: this.actionGroupProps.length + 1, type: '', target: -1, variables: [],
        errorMsgVar: -1, errorMsgShowResponse: false
      })
    },
    deleteAction(action: ActionProp): void {
      (this.actionGroupProps as ActionProp[]).forEach((actionProp, index) => {
        if (actionProp == action) {
          (this.actionGroupProps as ActionProp[]).splice(index, 1)
        }
      })
    }
  },
  beforeMount() {
    this.actionGroupProps = this.actionsGroup.props
  }
})
</script>

<style scoped>

</style>