<template>
  <v-row
      class="editor--element editor--row"
      @drop.self="onDrop"
      @click.self="setActive(appWidget)"
      @dragover.prevent
      @dragenter.prevent
      @click.prevent>

    <GuiEditorWidgetHeader :widget="widget" @activewidget="setActive" @move="move"/>

    <template v-for="(child) in widget.children">
      <GuiEditorWidget :widget="child" :key="child.name" @activewidget="setActive" @move="move"/>
    </template>

    <AppSnackbar :snackbar="errSnackbar" :text="errSnackbarMsg"/>

  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import AppSnackbar from "@/components/snackbar/AppSnackbar.vue";
import GuiEditorWidgetHeader from "@/views/editor/guieditor/component/widget/GuiEditorWidgetHeader.vue";
import {AppWidget, AppWidgetProp} from "@/lib/types";

export default Vue.extend({
  name: 'GuiEditorWidgetRow',
  components: {
    GuiEditorWidgetHeader,
    AppSnackbar,
    GuiEditorWidget: () => import( "@/views/editor/guieditor/component/widget/GuiEditorWidget.vue"),
  },
  props: {widget: Object},
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
          const msg = this.$t('editor.unsupportedElementMsg').toString()

          this.errSnackbar = true
          this.errSnackbarMsg = msg + this.widget.label + ': ' + allowedChildren
          return
        }

        (this.row.children as AppWidgetProp[]).push(widget);
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
    this.row = this.widget
  }
})
</script>

<style scoped>

</style>