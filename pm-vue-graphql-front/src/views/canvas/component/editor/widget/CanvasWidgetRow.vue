<template>
  <v-row
      class="canvas__editor--element pa-3"
      @drop.self="onDrop"
      @click.self="setActive(appWidget)"
      @dragover.prevent
      @dragenter.prevent
      @click.prevent>

    <div class="mb-2 secondary text-body-2 text-start pa-2 canvas__editor--row" @click="setActive(appWidget)">
      {{ widget.id }} :: {{ widget.type }}
    </div>

    <template v-for="(child) in widget.children">
      <CanvasWidget :widget="child" :key="child.name" @activewidget="setActive"/>
    </template>

  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import {AppWidget, AppWidgetProp} from "@/plugins/types";

export default Vue.extend({
  name: 'CanvasWidgetRow',
  components: {CanvasWidget: () => import( "@/views/canvas/component/editor/widget/CanvasWidget.vue")},
  props: {
    widget: Object
  },
  data() {
    return {
      row: {children: []}
    }
  },
  computed: {
    groups(): [] {
      return this.widget ? (this.widget as AppWidget).propGroups : []
    },
    cssProps(): { [x: string]: string; }[] {
      let props: AppWidgetProp[] = []
      this.groups.forEach((group: { props: AppWidgetProp }) => props = props.concat(group.props))
      return props.map((prop: AppWidgetProp) => {
        return {[prop.id]: prop.value}
      })
    },
    appWidget(): AppWidget {
      return this.widget as AppWidget
    }
  },
  methods: {
    onDrop(evt?: DragEvent) {
      const dataTransfer = evt?.dataTransfer;

      if (dataTransfer != null) {
        // eslint-disable-next-line
        const widget = dataTransfer!.getData('widget');
        (this.row.children as AppWidgetProp[]).push(JSON.parse(widget));
      }
    },
    setActive(widget: AppWidget) {
      this.$emit('activewidget', widget)
    }
  },
  beforeMount() {
    this.row = this.widget
  }
})
</script>

<style scoped>

</style>