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
          <v-btn text block class="text-body-2" :style="{'opacity': navTab === 1 ? '1.0' : '0.2'}" @click="setTab(1)">
            {{ i18n('editor.variables') }}
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

        <v-text-field class="pa-3" outlined color="accent" dense hide-details v-model="currentWidget.id"/>

        <template v-for="(group, index) in groups">
          <div class="secondary text-start text-body-2 pa-3 pl-6" :key="index">
            {{ group.label }}
          </div>

          <v-row no-gutters :key="group.id" class="pb-3">
            <v-col class="pl-3 pr-3 pb-1" cols="12" v-for="(prop) in group.props" :key="prop.id">
              <GuiEditorProp :prop="prop" :theme="theme" :queries="queries" :schema="schema" :variables="variables"/>
            </v-col>
          </v-row>
        </template>

        <v-row no-gutters class="pa-3 pt-6">
          <IconButton
              class="ml-auto"
              color="error"
              icon="fa-trash-can"
              :label="i18n('editor.deleteComponent')"
              @click="deleteComponent">
          </IconButton>
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

    <template v-if="navTab === 1">
      <GuiEditorAddPropDialog :dialog="addVarDialog" @close="closeAddVar" @refresh="refreshVars"/>

      <v-container v-for="(type, index) in varTypes" :key="index" fluid class="text-start pa-0">
        <div class="secondary text-start text-body-2 pa-3 pl-6">
          {{ type }}
        </div>

        <template v-for="(variable, index) in variables">
          <div v-if="variable.type_display === type" :key="index" class="pa-0 pt-1">
            <v-row no-gutters>
              <v-col cols="10">
                <i><b class="pa-4 pt-2 text-body-2">{{ variable.name }}</b></i>

                <v-text-field
                    class="pa-3 pt-1"
                    color="accent"
                    :value="variable.value"
                    outlined hide-details dense readonly disabled>
                </v-text-field>
              </v-col>

              <v-col cols="2" class="mt-auto text-end">
                <v-btn fab x-small height="30" class="mr-3 mb-4" color="error" @click="deleteVar(variable.id)">
                  <v-icon small>fa-trash-can</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </template>
      </v-container>

      <IconButton
          class="mr-2 mt-4 ml-auto"
          color="success"
          icon="fa-add"
          :label="i18n('editor.addVariable')"
          @click="addProp">
      </IconButton>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from "vue";
import IconButton from "@/components/button/IconButton.vue";
import GuiEditorProp from "@/views/editor/guieditor/component/property/GuiEditorProp.vue";
import GuiEditorAddPropDialog from "@/views/editor/guieditor/component/dialog/GuiEditorAddPropDialog.vue";
import {DELETE_PROP} from "@/graphql/queries/prop";
import {PageVariable} from "@/lib/types";

export default Vue.extend({
  name: 'GuiEditorRightNav',
  components: {
    GuiEditorAddPropDialog,
    GuiEditorProp,
    IconButton
  },
  props: {
    widget: Object,
    theme: Object,
    queries: Array,
    schema: Array,
    variables: Array
  },
  data() {
    return {
      currentWidget: null,
      addVarDialog: false,
      navTab: 0,
      widgetKey: 0,
      groups: [],
      height: ''
    }
  },
  computed: {
    id(): string {
      return this.currentWidget ? (this.currentWidget as { id: '', propGroups: [] }).id : ''
    },
    varTypes(): string[] {
      return (this.variables as PageVariable[])
          ?.map((variable) => variable.type_display)
          .filter((v, i, a) => a.indexOf(v) === i);
    }
  },
  watch: {
    widget: {
      handler() {
        if (this.currentWidget != this.widget) {
          this.widgetKey = this.widgetKey + 1
          this.currentWidget = this.widget
          this.groups = []
          this.groups = this.currentWidget ? (this.currentWidget as { id: '', propGroups: [] }).propGroups : []
        }
      },
      deep: true
    }
  },
  methods: {
    setTab(tabNum: number): void {
      this.navTab = tabNum
    },
    deleteComponent(): void {
      this.currentWidget = null
      this.$emit('delete')
    },
    addProp(): void {
      this.addVarDialog = true
    },
    closeAddVar(): void {
      this.addVarDialog = false
    },
    refreshVars(): void {
      this.$emit('refreshvars')
    },
    deleteVar(id: number): void {
      this.$apollo.mutate({mutation: DELETE_PROP, variables: {id: id}}).then(async () => {
        this.$emit('refreshvars')
      })
    }
  },
  beforeMount() {
    this.height = `${window.innerHeight - 124}px`

    addEventListener('resize', () => {
      this.height = `${window.innerHeight - 124}px`
    })
  }
})
</script>

<style scoped>

</style>