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
      <v-card
          v-for="(widget, index) in widgets"
          :key="index"
          class="editor--toolbox-widget ma-2 mb-3"
          draggable="true"
          elevation="0"
          color="primary"
          @dragstart="startDrag(widget, $event)">

        <v-container>
          <v-row>
            <v-col class="pa-0 ma-auto" cols="3">
              <v-icon>{{ widget.icon }}</v-icon>
            </v-col>

            <v-col class="pa-2 ma-auto text-start" cols="8">{{ widget.label }}</v-col>
          </v-row>
        </v-container>
      </v-card>
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
          :items="[pageDefinition]">

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

export default Vue.extend({
  name: 'GuiEditorEditorLeftNav',
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
    widgets() {
      return lib.widgets.filter((widget) => widget.type !== 'Page' && widget.type !== 'Common')
    },
    commonProps() {
      const common = JSON.parse(JSON.stringify(lib.widgets.filter((widget) => widget.type === 'Common')))[0]
      return common.propGroups
    }
  },
  methods: {
    setTab(tabNum: number): void {
      this.navTab = tabNum
    },
    startDrag(widget: { id: string }, evt?: DragEvent) {
      const dataTransfer = evt?.dataTransfer;

      const widgetJSON = JSON.parse(JSON.stringify(widget))
      widgetJSON.propGroups.push(...this.commonProps)

      if (dataTransfer != null) {
        // eslint-disable-next-line
        dataTransfer!.dropEffect = 'move'
        // eslint-disable-next-line
        dataTransfer!.effectAllowed = 'move'
        // eslint-disable-next-line
        dataTransfer!.setData('widget', JSON.stringify(widgetJSON))
      }
    },
    setActiveWidget(widget: AppWidget): void {
      this.$emit('activewidget', widget)
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