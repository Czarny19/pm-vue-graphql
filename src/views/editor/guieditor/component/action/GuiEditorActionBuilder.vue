<template>
  <div>
    <div class="secondary text-start text-body-2 pa-3 pl-6">
      {{ actionsGroup.label }}
    </div>

    <v-container fluid class="pa-4">
      <v-row v-for="(prop, index) in actionsGroup.props" :key="index">
        <v-col cols="10" class="text-start text-body-1 pl-4">
          {{ `${i18n('editor.action')}: ${index + 1}` }}
        </v-col>

        <v-col v-if="!actionsGroup.addLocked" cols="2" class="text-end">
          <v-btn class="mr-2" fab height="24" width="24" color="error" @click="deleteAction(prop)">
            <v-icon x-small>fa-times</v-icon>
          </v-btn>
        </v-col>

        <v-col cols="12">
          <v-select
              class="pt-1"
              color="accent"
              outlined dense hide-details
              :label="i18n('editor.actionType')"
              :items="['', ...types]"
              v-model="prop.type"
              item-value="id"
              item-text="name"
              item-color="accent">
          </v-select>
        </v-col>

        <v-col cols="12" v-if="prop.type">
          <GuiEditorActionRunMutation
              v-if="prop.type === 'runMutation'"
              :prop="prop"
              :mutations="mutations"
              :variables="variables">
          </GuiEditorActionRunMutation>

          <GuiEditorActionGoToPage
              v-if="prop.type === 'goToPage'"
              :prop="prop"
              :page="page"
              :pages="pages"
              :widget="widget"
              :schema="schema"
              :variables="variables">
          </GuiEditorActionGoToPage>
        </v-col>

        <v-col cols="12">
          <v-divider></v-divider>
        </v-col>
      </v-row>

      <v-row no-gutters v-if="!actionsGroup.addLocked">
        <v-col class="text-start">
          <IconButton
              class="mt-2 mb-5"
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
        id: this.actionGroupProps.length + 1,
        type: '',
        target: -1,
        variables: []
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