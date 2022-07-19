<template>
  <div>
    <div class="text-start text-body-2 secondary pa-4" @click="setActive(appWidget)">
      {{ widget.id }}
    </div>

    <div
        class="canvas__editor--element pa-4"
        :style="{'background-color': theme.background_color}"
        @drop.self="onDrop"
        @click.self="setActive(appWidget)"
        @dragover.prevent
        @dragenter.prevent
        @click.prevent>

      <template v-for="(child) in widget.children">
        <CanvasWidget :widget="child" :theme="theme" :key="child.name" @activewidget="setActive"/>
      </template>

    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {AppWidget, AppWidgetProp} from "@/plugins/types";

export default Vue.extend({
  name: 'CanvasWidgetPage',
  components: {CanvasWidget: () => import("@/views/canvas/component/editor/widget/CanvasWidget.vue")},
  props: {
    widget: Object,
    theme: Object
  },
  data() {
    return {
      page: {children: []}
    }
  },
  computed: {
    groups(): [] {
      return this.widget ? (this.widget as AppWidget).propGroups : []
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
        (this.page.children as AppWidgetProp[]).push(JSON.parse(widget));
      }
    },
    setActive(widget: AppWidget) {
      this.$emit('activewidget', widget)
    }
  },
  beforeMount() {
    this.page = this.widget
  }
})
</script>

<style scoped>

</style>