<template>
  <v-container fluid class="pa-0 full-height">

    <v-container v-if="!previewOpen" fluid class="primary pa-0" :style="{'height': '46px'}">
      <v-row no-gutters>
        <v-col class="pa-1 text-start">
          <v-btn text class="text-body-2" @click="changeLeftNavShown">
            <v-icon v-if="leftNavShown" class="pr-2">fa-caret-left</v-icon>
            {{ leftNavShown ? i18n('common.hide') : i18n('common.show') }}
            <v-icon v-if="!leftNavShown" class="pl-2">fa-caret-right</v-icon>
          </v-btn>
        </v-col>

        <v-spacer></v-spacer>

        <v-col class="pa-1 text-end">
          <v-btn text class="text-body-2" @click="changeRightNavShown">
            <v-icon v-if="!rightNavShown" class="pr-2">fa-caret-left</v-icon>
            {{ rightNavShown ? i18n('common.hide') : i18n('common.show') }}
            <v-icon v-if="rightNavShown" class="pl-2">fa-caret-right</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-divider></v-divider>
    </v-container>

    <WidgetPage
        v-if="previewOpen"
        class="fill-height"
        :widget="pageDefinition"
        :theme="theme"
        :datasource="datasource"
        :variables="variables"
    />

    <GuiEditorWidgetPage
        v-else
        :style="{'height': height, 'overflow': 'auto'}"
        :widget="pageDefinition"
        :drag="drag"
        @activewidget="setActive"
        @dragstarted="dragStart"
        @dragended="dragEnd"
    />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import GuiEditorWidgetPage from "@/views/editor/guieditor/component/widget/GuiEditorWidgetPage.vue";
import WidgetPage from "@/components/widget/grid/WidgetPage.vue";
import {AppWidget} from "@/lib/types";

export default Vue.extend({
  name: 'GuiEditorDisplay',
  components: {WidgetPage, GuiEditorWidgetPage},
  props: {
    pageDefinition: Object,
    theme: Object,
    leftNavShown: Boolean,
    rightNavShown: Boolean,
    previewOpen: Boolean,
    drag: Boolean,
    datasource: Object,
    variables: Array
  },
  data() {
    return {
      height: ''
    }
  },
  methods: {
    setActive(widget: AppWidget): void {
      this.$emit('activewidget', widget);
    },
    dragStart(): void {
      this.$emit('dragstarted');
    },
    dragEnd(): void {
      this.$emit('dragended');
    },
    changeLeftNavShown(): void {
      this.$emit('changeleftnav');
    },
    changeRightNavShown(): void {
      this.$emit('changerightnav');
    }
  },
  beforeMount() {
    this.height = `${window.innerHeight - 170}px`;

    addEventListener('resize', () => {
      this.height = `${window.innerHeight - 170}px`;
    });
  }
})
</script>

<style scoped>

</style>