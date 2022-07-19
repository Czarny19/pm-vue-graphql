<template>
  <v-row
      class="canvas__editor--element pa-3"
      @drop.self="onDrop"
      @click.self="setActive(appWidget)"
      @dragover.prevent
      @dragenter.prevent
      @click.prevent
      :style="cssProps">

    <div class="mb-2 secondary text-body-2 text-start pa-2 canvas__editor--row" @click="setActive(appWidget)">
      {{ widget.id }} :: {{ widget.type }}
    </div>

    <template v-for="(child) in widget.children">
      <CanvasWidget :widget="child" :key="child.name" @activewidget="setActive"/>
    </template>

    <AppSnackbar :snackbar="errSnackbar" :text="errSnackbarMsg"/>

  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import AppSnackbar from "@/components/snackbar/AppSnackbar.vue";
import {AppWidget, AppWidgetProp} from "@/plugins/types";
import {getCssProps} from "@/views/canvas/component/editor/widget/canvas-widget";

export default Vue.extend({
  name: 'CanvasWidgetRow',
  components: {AppSnackbar, CanvasWidget: () => import( "@/views/canvas/component/editor/widget/CanvasWidget.vue")},
  props: {
    widget: Object,
    theme: Object
  },
  data() {
    return {
      row: {children: [], allowedChildren: []},
      errSnackbar: false,
      errSnackbarMsg: ''
    }
  },
  computed: {
    appWidget(): AppWidget {
      return this.widget as AppWidget
    },
    cssProps(): ({ [p: string]: string })[] {
      return getCssProps(this.appWidget, this.theme)
    }
  },
  methods: {
    onDrop(evt?: DragEvent): void {
      const dataTransfer = evt?.dataTransfer;

      if (dataTransfer != null) {
        // eslint-disable-next-line
        const widget = JSON.parse(dataTransfer!.getData('widget'));
        const allowedChildren = this.row.allowedChildren;

        if (allowedChildren && !(allowedChildren as string[]).includes(widget.label)) {
          const msg = this.$t('canvas.unsupportedElementMsg').toString()

          this.errSnackbar = true
          this.errSnackbarMsg = msg + this.widget.label + ': ' + allowedChildren
          return
        }

        (this.row.children as AppWidgetProp[]).push(widget);
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