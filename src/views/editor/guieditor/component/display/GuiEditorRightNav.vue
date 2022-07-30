<template>
  <v-navigation-drawer permanent clipped right width="100%" color="secondary">
    <v-container fluid class="primary pa-0">
      <v-row no-gutters>
        <v-col class="pa-1">
          <v-btn text block class="text-body-2" :style="{'opacity': navTab === 0 ? '1.0' : '0.3'}" @click="setTab(0)">
            {{ i18n('editor.design') }}
          </v-btn>
        </v-col>
        <v-col class="pa-1">
          <v-btn text block class="text-body-2" :style="{'opacity': navTab === 1 ? '1.0' : '0.2'}" @click="setTab(1)">
            {{ i18n('editor.data') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-divider></v-divider>

    <template v-if="navTab === 0">
      <v-container v-if="currentWidget" fluid class="pa-4">
        <v-row class="text-start">
          <v-col class="mt-auto" cols="3">
            <div class="text-body-1">{{ i18n('editor.componentName') }}:</div>
          </v-col>
          <v-col>
            <v-text-field color="accent" flat single-line dense hide-details v-model="currentWidget.id"/>
          </v-col>
        </v-row>

        <v-row>
          <v-expansion-panels v-if="nonDataGroups" class="pa-1" multiple>
            <v-expansion-panel v-for="(group) in nonDataGroups" :key="group.id">
              <v-expansion-panel-header class="primary text-start pt-0 pb-0 pl-4 pr-4" expand-icon="fa-angle-down">
                {{ group.label }}
              </v-expansion-panel-header>

              <v-expansion-panel-content class="pt-1 text-start">
                <template v-for="(prop) in group.props">
                  <GuiEditorPropertyString :key="prop.id" v-if="prop.type === 'String'" :prop="prop"/>
                  <GuiEditorPropertySize :key="prop.id" v-else-if="prop.type === 'Size'" :prop="prop"/>
                  <GuiEditorPropertyColor :key="prop.id" v-else-if="prop.type === 'Color'" :prop="prop" :theme="theme"/>
                  <GuiEditorPropertyBorder :key="prop.id" v-else-if="prop.type === 'Border'" :prop="prop"/>
                  <GuiEditorPropertyCols :key="prop.id" v-else-if="prop.type === 'Cols'" :prop="prop"/>
                  <GuiEditorPropertyQuery
                      :key="prop.id"
                      v-else-if="prop.type === 'Query'"
                      :prop="prop"
                      :queries="queries">
                  </GuiEditorPropertyQuery>
                </template>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-row>

        <v-row class="pa-1 pt-4">
          <v-btn color="error" block @click="deleteComponent">
            {{ i18n('editor.deleteComponent') }}
            <v-icon small class="pl-6">fa-trash-can</v-icon>
          </v-btn>
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

    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from "vue";
import GuiEditorPropertyString from "@/views/editor/guieditor/component/property/GuiEditorPropertyString.vue";
import GuiEditorPropertySize from "@/views/editor/guieditor/component/property/GuiEditorPropertySize.vue";
import GuiEditorPropertyColor from "@/views/editor/guieditor/component/property/GuiEditorPropertyColor.vue";
import GuiEditorPropertyBorder from "@/views/editor/guieditor/component/property/GuiEditorPropertyBorder.vue";
import GuiEditorPropertyCols from "@/views/editor/guieditor/component/property/GuiEditorPropertyCols.vue";
import GuiEditorPropertyQuery from "@/views/editor/guieditor/component/property/GuiEditorPropertyQuery.vue";

export default Vue.extend({
  name: 'GuiEditorRightNav',
  components: {
    GuiEditorPropertyQuery,
    GuiEditorPropertyString,
    GuiEditorPropertySize,
    GuiEditorPropertyColor,
    GuiEditorPropertyBorder,
    GuiEditorPropertyCols
  },
  props: {
    widget: Object,
    theme: Object,
    queries: Array,
  },
  data() {
    return {
      currentWidget: null,
      navTab: 0,
      groups: []
    }
  },
  computed: {
    id() {
      return this.currentWidget ? (this.currentWidget as { id: '', propGroups: [] }).id : ''
    },
    dataGroups() {
      return this.groups.filter((group) => (group as { id: string }).id === 'data')
    },
    nonDataGroups() {
      return this.groups.filter((group) => (group as { id: string }).id !== 'data')
    }
  },
  watch: {
    widget: {
      handler() {
        this.currentWidget = this.widget
        this.groups = []
        this.groups = this.currentWidget ? (this.currentWidget as { id: '', propGroups: [] }).propGroups : []
      },
      deep: true
    }
  },
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    },
    setTab(tabNum: number): void {
      this.navTab = tabNum
    },
    deleteComponent(): void {
      this.$emit('delete')
    }
  }
})
</script>

<style scoped>

</style>