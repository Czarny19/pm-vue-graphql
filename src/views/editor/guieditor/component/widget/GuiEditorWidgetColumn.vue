<template>
  <v-col
      :cols="argsProps.cols ? Number(argsProps.cols) : ''"
      class="editor--element editor--column pa-0"
      @drop.self="onDrop"
      @click.self="setActive(appWidget)"
      @dragover.prevent
      @dragenter.prevent
      @click.prevent>

    <GuiEditorWidgetHeader :widget="widget" hide-move @activewidget="setActive" @move="move"/>

    <template v-for="(child) in appWidget.children">
      <GuiEditorWidget class="mr-2 ml-2 mb-2" :widget="child" :key="child.name" @activewidget="setActive" @move="move"/>
    </template>

    <AppSnackbar :snackbar="errSnackbar" :text="errSnackbarMsg"/>

  </v-col>
</template>

<script lang="ts">
import Vue from "vue";
import AppSnackbar from "@/components/snackbar/AppSnackbar.vue";
import GuiEditorWidgetHeader from "@/views/editor/guieditor/component/widget/GuiEditorWidgetHeader.vue";
import {AppWidget, AppWidgetProp} from "@/lib/types";
import {getArgsProps} from "@/lib/widget";

export default Vue.extend({
  name: 'GuiEditorWidgetColumn',
  components: {
    GuiEditorWidgetHeader,
    AppSnackbar,
    GuiEditorWidget: () => import( "@/views/editor/guieditor/component/widget/GuiEditorWidget.vue"),
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
          const msg = this.$t('editor.unsupportedElementMsg').toString()

          this.errSnackbar = true
          this.errSnackbarMsg = msg + this.widget.label + ': ' + allowedChildren.join(', ')
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