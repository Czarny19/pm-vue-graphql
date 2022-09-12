<template>
  <v-container fluid class="pa-0 pb-8">
    <div v-for="(prop, index) in actionsGroup.props" :key="index">
      <div class="secondary text-start text-body-2 pa-3 pl-6">
        {{ `${i18n('editor.action')}: ${index + 1}` }}
      </div>

      <div class="pa-4">
        <v-btn class="mt-2 mb-4 ml-auto mr-2" block small color="error" @click="deleteAction(prop)">
          {{ `${i18n('editor.deleteAction')} ${index + 1}` }}
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
            item-color="accent"
        />

        <template v-if="prop.type">
          <GuiEditorActionRunMutation
              class="pt-2"
              v-if="prop.type === 'runMutation'"
              :prop="prop"
              :page="page"
              :mutations="mutations"
              :schema="schema"
              :variables="variables"
          />

          <GuiEditorActionYesNoDialog
              class="pt-2"
              v-if="prop.type === 'yesNoDialog'"
              :prop="prop"
              :variables="variables"
          />

          <GuiEditorActionGoToPage
              class="pt-2"
              v-if="prop.type === 'goToPage'"
              :prop="prop"
              :page="page"
              :pages="pages"
              :schema="schema"
              :variables="variables"
          />
        </template>
      </div>
    </div>

    <v-row no-gutters v-if="!actionsGroup.addLocked">
      <v-col>
        <IconButton
            class="mr-3 mt-4 mb-4 ml-3"
            :label="i18n('editor.addAction')"
            color="success"
            icon="fa-plus"
            @click="addAction"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import IconButton from "@/components/button/IconButton.vue";
import GuiEditorActionYesNoDialog from "@/views/editor/guieditor/component/action/GuiEditorActionYesNoDialog.vue";
import GuiEditorActionGoToPage from "@/views/editor/guieditor/component/action/GuiEditorActionGoToPage.vue";
import GuiEditorActionRunMutation from "@/views/editor/guieditor/component/action/GuiEditorActionRunMutation.vue";
import {ActionProp} from "@/lib/types";
import {getActionTypes} from "@/lib/widget";

export default Vue.extend({
  name: 'GuiEditorActionBuilder',
  components: {GuiEditorActionYesNoDialog, IconButton, GuiEditorActionGoToPage, GuiEditorActionRunMutation},
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
      const availableActions = this.actionsGroup.actions;

      console.log(getActionTypes())

      if (!availableActions) {
        return getActionTypes();
      }

      return getActionTypes().filter((type) => availableActions.includes(type.id));
    }
  },
  methods: {
    addAction(): void {
      (this.actionGroupProps as ActionProp[]).push({
        id: this.actionGroupProps.length + 1, type: '', target: -1, variables: [],
        errorMsgVar: -1, errorMsgShowResponse: false
      });
    },
    deleteAction(action: ActionProp): void {
      (this.actionGroupProps as ActionProp[]).forEach((actionProp, index) => {
        if (actionProp == action) {
          this.actionGroupProps.splice(index, 1);
        }
      });
    }
  },
  beforeMount() {
    this.actionGroupProps = this.actionsGroup.props;
  }
})
</script>

<style scoped>

</style>