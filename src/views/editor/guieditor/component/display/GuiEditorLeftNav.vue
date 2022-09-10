<template>
  <v-navigation-drawer permanent clipped width="100%" color="primary" :style="{'height': height}">
    <v-container fluid class="primary pa-0">
      <v-row no-gutters>
        <v-col class="pa-1">
          <v-btn text block class="text-body-2" :style="{'opacity': navTab === 0 ? '1.0' : '0.3'}" @click="setTab(0)">
            {{ i18n('editor.components') }}
          </v-btn>
        </v-col>
        <v-col class="pa-1">
          <v-btn text block class="text-body-2" :style="{'opacity': navTab === 1 ? '1.0' : '0.2'}" @click="setTab(1)">
            {{ i18n('editor.layout') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-divider></v-divider>

    <template v-if="navTab === 0">
      <GuiEditorLeftNavWidgets
          :label="i18n('editor.widgetsGrid')"
          :widgets="gridWidgets"
          @dragstarted="dragStart"
          @dragended="dragEnd"
      />

      <GuiEditorLeftNavWidgets
          :label="i18n('editor.widgetsDisplay')"
          :widgets="displayWidgets"
          @dragstarted="dragStart"
          @dragended="dragEnd"
      />

      <GuiEditorLeftNavWidgets
          :label="i18n('editor.widgetsInput')"
          :widgets="inputWidgets"
          @dragstarted="dragStart"
          @dragended="dragEnd"
      />
    </template>

    <template v-if="navTab === 1">
      <v-treeview
          class="pointer"
          open-all
          dense
          item-text="title"
          expand-icon="fa-caret-down"
          item-children="children"
          color="accent"
          :items="[pageDefinition]"
      >
        <template v-slot:prepend="{ item }">
          <v-icon color="accent" small v-if="item.icon" @click="setActiveWidget(item)">
            {{ item.icon }}
          </v-icon>
        </template>

        <template v-slot:label="{ item }">
          <div class="text-start text-body-2 pl-2 overflow-elipsis" @click="setActiveWidget(item)">
            {{ item.id }} ({{ item.label }})
          </div>
        </template>

      </v-treeview>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from "vue";
import lib from "@/lib/widgets.json";
import {AppWidget} from "@/lib/types";
import GuiEditorLeftNavWidgets from "@/views/editor/guieditor/component/display/GuiEditorLeftNavWidgets.vue";

export default Vue.extend({
  name: 'GuiEditorLeftNav',
  components: {GuiEditorLeftNavWidgets},
  props: {
    pageDefinition: {}
  },
  data() {
    return {
      navTab: 0,
      widgetIndex: 1,
      height: ''
    }
  },
  computed: {
    gridWidgets() {
      return lib.widgets.filter((widget) => widget.group === 'Grid');
    },
    displayWidgets() {
      return lib.widgets.filter((widget) => widget.group === 'Display');
    },
    inputWidgets() {
      return lib.widgets.filter((widget) => widget.group === 'Input');
    }
  },
  methods: {
    setTab(tabNum: number): void {
      this.navTab = tabNum;
    },
    setActiveWidget(widget: AppWidget): void {
      this.$emit('activewidget', widget);
    },
    dragStart(): void {
      this.$emit('dragstarted');
    },
    dragEnd(): void {
      this.$emit('dragended');
    }
  },
  beforeMount() {
    this.height = `${window.innerHeight - 124}px`;

    addEventListener('resize', () => {
      this.height = `${window.innerHeight - 124}px`;
    });
  }
})
</script>

<style scoped>

</style>