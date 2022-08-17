<template>
  <v-navigation-drawer permanent clipped right width="100%" color="secondary">
    <v-container fluid class="primary pa-0">
      <v-row no-gutters>
        <v-col class="pa-1">
          <v-btn text block class="text-body-2 disable-events">
            {{ i18n('editor.design') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-divider></v-divider>

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
        <v-expansion-panels v-if="groups" class="pa-1" multiple>
          <v-expansion-panel v-for="(group) in groups" :key="group.id">
            <v-expansion-panel-header class="primary text-start pt-0 pb-0 pl-4 pr-4" expand-icon="fa-angle-down">
              {{ group.label }}
            </v-expansion-panel-header>

            <v-expansion-panel-content class="pt-1 text-start">
              <template v-for="(prop) in group.props">
                <GuiEditorPropertyString :key="prop.id" v-if="prop.type === 'String'" :prop="prop"/>
                <GuiEditorPropertyQuery
                    :key="prop.id"
                    v-if="prop.type === 'Query'"
                    :prop="prop"
                    :queries="queries">
                </GuiEditorPropertyQuery>
                <GuiEditorPropertySize :key="prop.id" v-else-if="prop.type === 'Size'" :prop="prop"/>
                <GuiEditorPropertyColor :key="prop.id" v-else-if="prop.type === 'Color'" :prop="prop" :theme="theme"/>
                <GuiEditorPropertyBorder :key="prop.id" v-else-if="prop.type === 'Border'" :prop="prop"/>
                <GuiEditorPropertyCols :key="prop.id" v-else-if="prop.type === 'Cols'" :prop="prop"/>
              </template>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-row>

      <v-row class="pa-1 pt-2">
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
import IconButton from "@/components/button/IconButton.vue";

export default Vue.extend({
  name: 'GuiEditorRightNav',
  components: {
    IconButton,
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