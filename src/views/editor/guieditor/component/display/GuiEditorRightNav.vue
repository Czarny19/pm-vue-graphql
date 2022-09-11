<template>
  <v-navigation-drawer permanent clipped right width="100%" color="primary" :style="{'height': height}">
    <v-container fluid class="primary pa-0">
      <v-row no-gutters>
        <v-col class="pa-1">
          <v-btn text block class="text-body-2" :style="{'opacity': navTab === 0 ? '1.0' : '0.3'}" @click="setTab(0)">
            {{ i18n('editor.design') }}
          </v-btn>
        </v-col>
        <v-col class="pa-1">
          <v-btn text block class="text-body-2" :style="{'opacity': navTab === 1 ? '1.0' : '0.3'}" @click="setTab(1)">
            {{ i18n('editor.restricitons') }}
          </v-btn>
        </v-col>
        <v-col class="pa-1">
          <v-btn text block class="text-body-2" :style="{'opacity': navTab === 2 ? '1.0' : '0.3'}" @click="setTab(2)">
            {{ i18n('editor.actions') }}
          </v-btn>
        </v-col>
        <v-col class="pa-1">
          <v-btn text block class="text-body-2" :style="{'opacity': navTab === 3 ? '1.0' : '0.2'}" @click="setTab(3)">
            {{ i18n('editor.variables') }}
          </v-btn>
        </v-col>
        <v-col class="pa-1">
          <v-btn text block class="text-body-2" :style="{'opacity': navTab === 4 ? '1.0' : '0.2'}" @click="setTab(4)">
            {{ i18n('editor.params') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-divider></v-divider>

    <template v-if="navTab === 0">
      <v-container v-if="currentWidget" :key="widgetKey" fluid class="text-start pa-0">
        <div class="secondary text-start text-body-2 pa-3 pl-6">
          {{ currentWidget.label }}
        </div>

        <v-text-field
            class="pa-3"
            outlined
            color="accent"
            dense
            hide-details
            :label="i18n('editor.description')"
            v-model="currentWidget.id"
        />

        <template v-for="(group, index) in groups">
          <template v-if="group.type !== 'action' && group.type !== 'condition'">
            <div class="secondary text-start text-body-2 pa-3 pl-6" :key="index">
              {{ group.label }}
            </div>

            <v-row no-gutters :key="group.id" class="pb-3">
              <v-col class="pl-3 pr-3 pb-1" cols="12" v-for="(prop) in group.props" :key="prop.id">
                <GuiEditorProp
                    :prop="prop"
                    :page="page"
                    :widget="widget"
                    :theme="theme"
                    :queries="queries"
                    :schema="schema"
                    :variables="variables"
                />
              </v-col>
            </v-row>
          </template>
        </template>

        <div class="secondary text-start text-body-2 pa-3 pl-6">
          {{ i18n('editor.options') }}
        </div>

        <v-row no-gutters class="pa-4 mb-8">
          <IconButton
              block
              class="ml-auto mb-4"
              color="error"
              icon="fa-trash-can"
              :label="i18n('editor.deleteComponent')"
              @click="deleteComponent"
          />
        </v-row>
      </v-container>

      <v-container v-else>
        <v-row>
          <v-col class="text-center mt-6">
            <v-btn class="disable-events" fab x-large>
              <v-icon x-large>fa-arrow-pointer</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="text-center mt-2 text-body-1">
            {{ i18n('editor.chooseComponent') }}
          </v-col>
        </v-row>
      </v-container>
    </template>

    <template v-else-if="navTab === 1">
      <GuiEditorConditionBuilder
          v-if="conditionPropGroup"
          :conditions-group="conditionPropGroup"
          :widget="widget"
          :schema="schema"
      />

      <v-container v-else>
        <v-row>
          <v-col class="text-center mt-6">
            <v-btn class="disable-events" fab x-large>
              <v-icon x-large>fa-arrow-pointer</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="text-center mt-2 text-body-1">
            {{ i18n('editor.chooseComponent') }}
          </v-col>
        </v-row>
      </v-container>
    </template>

    <template v-else-if="navTab === 2">
      <GuiEditorActionBuilder
          v-if="actionPropGroup"
          :actions-group="actionPropGroup"
          :mutations="mutations"
          :page="page"
          :pages="pages"
          :widget="widget"
          :schema="schema"
          :variables="variables"
      />

      <v-container v-else>
        <v-row>
          <v-col class="text-center mt-6">
            <v-btn class="disable-events" fab x-large color="error">
              <v-icon x-large>fa-computer-mouse</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="text-center mt-2 text-body-1">
            {{ i18n('editor.notSupportingActions') }}
          </v-col>
        </v-row>
      </v-container>
    </template>

    <template v-else-if="navTab === 3">
      <div class="secondary text-start text-body-2 pa-3 pl-6">
        {{ i18n('editor.props') }}
      </div>

      <GuiEditorAddPropDialog :dialog="addVarDialog" @close="closeAddVar" @refresh="refreshVars"/>

      <IconButton
          class="mr-3 mt-4 mb-4 ml-3"
          color="success"
          icon="fa-add"
          :label="i18n('editor.addVariable')"
          @click="addProp"
      />

      <v-container v-for="(type, index) in varTypes" :key="index" fluid class="text-start pa-0 pb-3">
        <div class="secondary text-start text-body-2 pa-3 pl-6">
          {{ type }}
        </div>

        <template v-for="(variable, index) in variables">
          <div v-if="variable.type_display === type" :key="index" class="pa-0 pt-1">
            <v-row no-gutters>
              <v-col cols="10">
                <i><b class="pa-4 text-body-2">{{ variable.name }}</b></i>

                <v-textarea
                    class="pl-3 pb-1 pt-0"
                    color="accent"
                    :rows="1"
                    :value="variable.value"
                    persistent-hint
                    outlined hide-details dense readonly disabled
                />
              </v-col>

              <v-col cols="2" class="mt-auto text-end">
                <v-btn fab x-small height="30" class="mr-3 mb-3" color="error" @click="deleteVar(variable.id)">
                  <v-icon class="ma-auto">fa-times</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </template>
      </v-container>
    </template>

    <template v-else-if="navTab === 4">
      <div class="secondary text-start text-body-2 pa-3 pl-6">
        {{ i18n('editor.pageParams') }}
      </div>

      <IconButton
          class="mr-3 mt-4 mb-4 ml-3"
          color="success"
          icon="fa-add"
          :label="i18n('editor.addParam')"
          @click="addParam"
      />

      <div class="pa-3 pb-8 text-start">
        <div class="pt-1">
          <v-row no-gutters v-for="(param, index) in currentParams" :key="index">
            <v-col cols="10">
              <v-text-field
                  class="pt-1 pb-3"
                  color="accent"
                  v-model="currentParams[index]"
                  outlined hide-details dense
              />
            </v-col>

            <v-col cols="2" class="mt-auto text-end" :key="param">
              <v-btn fab x-small height="30" class="mr-3 mb-4" color="error" @click="deleteParam(index)">
                <v-icon class="ma-auto">fa-times</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from "vue";
import IconButton from "@/components/button/IconButton.vue";
import GuiEditorProp from "@/views/editor/guieditor/component/property/GuiEditorProp.vue";
import GuiEditorAddPropDialog from "@/views/editor/guieditor/component/dialog/GuiEditorAddPropDialog.vue";
import GuiEditorActionBuilder from "@/views/editor/guieditor/component/action/GuiEditorActionBuilder.vue";
import {DELETE_PROP} from "@/graphql/queries/prop";
import {PageVariable} from "@/lib/types";
import GuiEditorConditionBuilder from "@/views/editor/guieditor/component/condition/GuiEditorConditionBuilder.vue";

export default Vue.extend({
  name: 'GuiEditorRightNav',
  components: {
    GuiEditorConditionBuilder,
    GuiEditorActionBuilder,
    GuiEditorAddPropDialog,
    GuiEditorProp,
    IconButton
  },
  props: {
    widget: Object,
    theme: Object,
    queries: Array,
    mutations: Array,
    schema: Array,
    page: Object,
    pages: Array,
    variables: Array,
    params: Array
  },
  data() {
    return {
      currentWidget: null,
      currentParams: [],
      addVarDialog: false,
      navTab: 0,
      widgetKey: 0,
      groups: [],
      height: ''
    }
  },
  computed: {
    id(): string {
      return this.currentWidget ? (this.currentWidget as { id: '', propGroups: [] }).id : '';
    },
    varTypes(): string[] {
      return (this.variables as PageVariable[])
          ?.map((variable) => variable.type_display)
          .filter((v, i, a) => a.indexOf(v) === i);
    },
    actionPropGroup(): { type: string } | undefined {
      return (this.groups as { type: string }[]).find((group) => group.type === 'action');
    },
    conditionPropGroup(): { type: string } | undefined {
      return (this.groups as { type: string }[]).find((group) => group.type === 'condition');
    }
  },
  watch: {
    widget: {
      handler() {
        if (this.currentWidget != this.widget) {
          this.widgetKey = this.widgetKey + 1;
          this.currentWidget = this.widget;
          this.groups = [];
          this.groups = this.currentWidget ? (this.currentWidget as { id: '', propGroups: [] }).propGroups : [];
        }
      },
      deep: true
    }
  },
  methods: {
    setTab(tabNum: number): void {
      this.navTab = tabNum;
    },
    deleteComponent(): void {
      this.currentWidget = null;
      this.$emit('delete');
    },
    addProp(): void {
      this.addVarDialog = true;
    },
    closeAddVar(): void {
      this.addVarDialog = false;
    },
    refreshVars(): void {
      this.$emit('refreshvars');
    },
    deleteVar(id: number): void {
      this.$apollo.mutate({mutation: DELETE_PROP, variables: {id: id}}).then(async () => {
        this.$emit('refreshvars');
      });
    },
    addParam(): void {
      (this.currentParams as string[]).push('');
    },
    deleteParam(index: number): void {
      (this.currentParams as string[]).splice(index, 1);
    }
  },
  beforeMount() {
    this.height = `${window.innerHeight - 124}px`;

    addEventListener('resize', () => {
      this.height = `${window.innerHeight - 124}px`;
    });

    (this.currentParams as string[]) = (this.params as string[]);
  }
})
</script>

<style scoped>

</style>