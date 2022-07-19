<template>
  <v-container
      fluid
      class="canvas__editor--element pa-0"
      @drop.self="onDrop"
      @click.self="setActive(appWidget)"
      @dragover.prevent
      @dragenter.prevent
      @click.prevent
      :style="cssProps">

    <div class="mb-2 secondary text-body-2 text-start pa-2" @click="setActive(appWidget)">
      {{ widget.id }} :: {{ widget.type }}
    </div>

    <template v-for="(child) in widget.children">
      <CanvasWidget class="ma-3" :widget="child" :key="child.name" @activewidget="setActive"/>
    </template>

    <AppSnackbar :snackbar="errSnackbar" :text="errSnackbarMsg"/>

  </v-container>
</template>

<script lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import Vue from "vue";
import {AppWidget, AppWidgetProp} from "@/plugins/types";
import AppSnackbar from "@/components/snackbar/AppSnackbar.vue";

export default Vue.extend({
  name: 'CanvasWidgetContainer',
  components: {AppSnackbar, CanvasWidget: () => import( "@/views/canvas/component/editor/widget/CanvasWidget.vue")},
  props: {
    widget: Object,
    theme: Object
  },
  data() {
    return {
      container: {children: []},
      errSnackbar: false,
      errSnackbarMsg: ''
    }
  },
  computed: {
    themeColors(): string [] {
      return ['primary_color', 'secondary_color', 'accent_color', 'info_color',
        'success_color', 'error_color', 'text_color_1', 'text_color_2', 'background_color']
    },
    groups(): [] {
      return this.widget ? (this.widget as AppWidget).propGroups : []
    },
    cssProps(): { [x: string]: string; }[] {
      let props: AppWidgetProp[] = []

      this.groups.forEach((group: { props: AppWidgetProp }) => props = props.concat(group.props))

      return props.map((prop: AppWidgetProp) => {
        if (prop.type === 'Color' && this.themeColors.includes(prop.value)) {
          return {[prop.id]: this.theme[prop.value]}
        }

        return {[prop.id]: prop.value + (prop.unit ?? '')}
      })
    },
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
        const allowedChildren = this.container.allowedChildren;

        if (allowedChildren && !allowedChildren.includes(widget.title)) {
          const msg = this.$t('canvas.unsupportedElementMsg').toString()

          this.errSnackbar = true
          this.errSnackbarMsg = msg + this.widget.title + ': ' + allowedChildren
          return
        }

        (this.container.children as AppWidgetProp[]).push(widget);
      }
    },
    setActive(widget: AppWidget): void {
      this.$emit('activewidget', widget)
    }
  },
  beforeMount() {
    this.container = this.widget
  }
})
</script>

<style scoped>

</style>