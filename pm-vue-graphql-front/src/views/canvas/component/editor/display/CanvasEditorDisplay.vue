<template>
  <v-container fluid class="pa-0 canvas__editor--display">
    <v-container fluid class="primary pa-0">
      <v-row no-gutters>
        <v-col class="pa-1 text-start">
          <v-btn text class="text-body-2" @click="changeLeftNavShown">
            <v-icon v-if="leftNavShown" class="pr-2">fa-caret-left</v-icon>
            {{ leftNavShown ? i18n('canvas.hide') : i18n('canvas.show') }}
            <v-icon v-if="!leftNavShown" class="pl-2">fa-caret-right</v-icon>
          </v-btn>
        </v-col>
        <v-spacer></v-spacer>
        <v-col class="pa-1 text-end">
          <v-btn text class="text-body-2" @click="changeRightNavShown">
            <v-icon v-if="!rightNavShown" class="pr-2">fa-caret-left</v-icon>
            {{ rightNavShown ? i18n('canvas.hide') : i18n('canvas.show') }}
            <v-icon v-if="rightNavShown" class="pl-2">fa-caret-right</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-divider></v-divider>
    </v-container>

    <CanvasWidgetPage :widget="pageDefinition" :theme="theme" @activewidget="setActive"/>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {AppWidget} from "@/plugins/types";
import CanvasWidgetPage from "@/views/canvas/component/editor/widget/CanvasWidgetPage.vue";

export default Vue.extend({
  name: 'CanvasEditorDisplay',
  components: {CanvasWidgetPage},
  props: {
    pageDefinition: Object,
    theme: Object,
    leftNavShown: Boolean,
    rightNavShown: Boolean
  },
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    },
    setActive(widget: AppWidget): void {
      this.$emit('activewidget', widget)
    },
    changeLeftNavShown(): void {
      this.$emit('changeleftnav')
    },
    changeRightNavShown(): void {
      this.$emit('changerightnav')
    }
  }
})
</script>

<style scoped>

</style>