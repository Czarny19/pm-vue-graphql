<template>
  <v-col
      class="canvas__editor--element pa-0"
      @drop.self="onDrop"
      @click.self="setActive(appWidget)"
      @dragover.prevent
      @dragenter.prevent
      @click.prevent>

    <div class="mb-2 secondary text-body-2 text-start pa-2" @click="setActive(appWidget)">
      {{ appWidget.id }} :: {{ appWidget.type }}
    </div>

    <template v-for="(child) in appWidget.children">
      <CanvasWidget :widget="child" :key="child.name" @activewidget="setActive"/>
    </template>

  </v-col>
</template>

<script lang="ts">
import Vue from "vue";
import {AppWidget, AppWidgetProp} from "@/plugins/types";

export default Vue.extend({
  name: 'CanvasWidgetColumn',
  components: {CanvasWidget: () => import( "@/views/canvas/component/editor/widget/CanvasWidget.vue")},
  props: {
    widget: Object
  },
  data() {
    return {
      column: {children: []}
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
        (this.column.children as AppWidgetProp[]).push(JSON.parse(widget));
      }
    },
    setActive(widget: AppWidget) {
      this.$emit('activewidget', widget)
    }
  },
  beforeMount() {
    this.column = this.widget
  }
})
</script>

<style scoped>

</style>