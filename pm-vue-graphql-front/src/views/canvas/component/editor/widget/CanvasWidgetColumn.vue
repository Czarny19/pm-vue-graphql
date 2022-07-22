<template>
  <v-col
      :cols="argsProps.cols ? Number(argsProps.cols) : ''"
      class="canvas__editor--element canvas__editor--column pa-0"
      @drop.self="onDrop"
      @click.self="setActive(appWidget)"
      @dragover.prevent
      @dragenter.prevent
      @click.prevent>

    <CanvasWidgetHeader :widget="widget" hide-move @activewidget="setActive" @move="move"/>

    <template v-for="(child) in appWidget.children">
      <CanvasWidget class="mr-2 ml-2 mb-2" :widget="child" :key="child.name" @activewidget="setActive" @move="move"/>
    </template>

    <AppSnackbar :snackbar="errSnackbar" :text="errSnackbarMsg"/>

  </v-col>
</template>

<script lang="ts">
import Vue from "vue";
import AppSnackbar from "@/components/snackbar/AppSnackbar.vue";
import CanvasWidgetHeader from "@/views/canvas/component/editor/widget/CanvasWidgetHeader.vue";
import {AppWidget, AppWidgetProp} from "@/plugins/types";
import {getArgsProps} from "@/plugins/widget";

export default Vue.extend({
  name: 'CanvasWidgetColumn',
  components: {
    CanvasWidgetHeader,
    AppSnackbar,
    CanvasWidget: () => import( "@/views/canvas/component/editor/widget/CanvasWidget.vue"),
  },
  props: {widget: Object},
  data() {
    return {
      column: {children: [], allowedChildren: []},
      errSnackbar: false,
      errSnackbarMsg: ''
    }
  },
  computed: {
    appWidget(): AppWidget {
      return this.widget as AppWidget
    },
    argsProps(): { [k: string]: string } {
      return getArgsProps(this.appWidget)
    }
  },
  methods: {
    onDrop(evt?: DragEvent): void {
      const dataTransfer = evt?.dataTransfer;

      if (dataTransfer != null) {
        // eslint-disable-next-line
        const widget = JSON.parse(dataTransfer!.getData('widget'));
        const allowedChildren = this.column.allowedChildren;

        if (allowedChildren && !(allowedChildren as string[]).includes(widget.label)) {
          const msg = this.$t('canvas.unsupportedElementMsg').toString()

          this.errSnackbar = true
          this.errSnackbarMsg = msg + this.widget.label + ': ' + allowedChildren
          return
        }

        (this.column.children as AppWidgetProp[]).push(widget);
      }
    },
    setActive(widget: AppWidget) {
      this.$emit('activewidget', widget)
    },
    move(up: boolean): void {
      this.$emit('move', up)
    }
  },
  beforeMount() {
    this.column = this.widget
  }
})
</script>

<style scoped>

</style>