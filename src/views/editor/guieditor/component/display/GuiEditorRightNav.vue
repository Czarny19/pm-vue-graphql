<template>
  <v-navigation-drawer permanent clipped right width="100%" color="primary">
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

    <v-container v-if="currentWidget" fluid class="text-start pa-0 pt-3">
      <b class="pa-4 pb-2 pt-4">{{ currentWidget.label }}</b>
      <v-text-field class="pa-3" outlined color="accent" dense hide-details v-model="currentWidget.id"/>
      <v-divider></v-divider>

      <template v-for="(group, index) in groups">
        <v-row no-gutters :key="group.id" class="pb-3">
          <b class="pa-3 pb-2 pt-4">{{ group.label }}</b>
          <v-col class="pl-3 pr-3 pb-1" cols="12" v-for="(prop) in group.props" :key="prop.id">
            <GuiEditorProp :prop="prop" :theme="theme" :queries="queries" :schema="schema"/>
          </v-col>
        </v-row>
        <v-divider :key="index"></v-divider>
      </template>

      <v-row no-gutters class="pa-3">
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
import IconButton from "@/components/button/IconButton.vue";
import GuiEditorProp from "@/views/editor/guieditor/component/property/GuiEditorProp.vue";

export default Vue.extend({
  name: 'GuiEditorRightNav',
  components: {
    GuiEditorProp,
    IconButton
  },
  props: {
    widget: Object,
    theme: Object,
    queries: Array,
    schema: Array
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
      this.currentWidget = null
      this.$emit('delete')
    }
  }
})
</script>

<style scoped>

</style>