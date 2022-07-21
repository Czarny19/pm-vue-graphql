<template>
  <v-navigation-drawer permanent clipped width="100%" color="secondary">
    <v-container fluid class="primary pa-0">
      <v-row no-gutters>
        <v-col class="pa-1">
          <v-btn text block class="text-body-2" :style="{'opacity': navTab === 0 ? '1.0' : '0.3'}" @click="setTab(0)">
            {{ i18n('canvas.components') }}
          </v-btn>
        </v-col>
        <v-col class="pa-1">
          <v-btn text block class="text-body-2" :style="{'opacity': navTab === 1 ? '1.0' : '0.2'}" @click="setTab(1)">
            {{ i18n('canvas.layout') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-divider></v-divider>

    <template v-if="navTab === 0">
      <v-card
          v-for="widget in widgets"
          :key="widget.title"
          class="canvas__editor--toolbox-widget ma-3"
          draggable="true"
          @dragstart="startDrag(widget, $event)">

        <v-container v-if="widget.type !== 'Page'">
          <v-row>
            <v-col class="pa-1 ma-auto" cols="3">
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
          activatable
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
          <div v-if="item.type === 'Page'"
               class="text-start text-body-2 pl-2 overflow-elipsis"
               @click="setActiveWidget(item)">
            {{ item.id }}
          </div>

          <div v-else class="text-start text-body-2 pl-2 overflow-elipsis" @click="setActiveWidget(item)">
            {{ item.id }} ({{ item.label }})
          </div>
        </template>

      </v-treeview>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from "vue";
import lib from "@/config/widgets.json";
import {AppWidget} from "@/plugins/types";

export default Vue.extend({
  name: 'CanvasEditorLeftNav',
  props: {
    pageDefinition: {}
  },
  data() {
    return {
      navTab: 0,
      widgetIndex: 1
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
    i18n(key: string): string {
      return this.$t(key).toString()
    },
    setTab(tabNum: number): void {
      this.navTab = tabNum
    },
    startDrag(widget: { id: string }, evt?: DragEvent) {
      widget.id = `el${this.widgetIndex++}`

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
  }
})
</script>

<style scoped>

</style>