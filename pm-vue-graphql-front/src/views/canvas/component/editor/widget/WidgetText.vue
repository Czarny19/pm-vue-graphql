<template>
  <div class="canvas__editor--element" :style="cssProps" @click.self="setActive(appWidget)">{{ argsProps.text }}</div>
</template>

<script lang="ts">
import Vue from "vue";
import {AppWidget, AppWidgetProp} from "@/plugins/types";

export default Vue.extend({
  name: 'WidgetText',
  props: {
    widget: Object
  },
  computed: {
    propGroups(): [] {
      return this.widget ? (this.widget as AppWidget).propGroups : []
    },
    cssProps(): { [x: string]: string; }[] {
      let cssProps: AppWidgetProp[] = []

      this.propGroups
          .filter((group: { type: string }) => group.type === 'css')
          .forEach((group: { props: AppWidgetProp }) => cssProps = cssProps.concat(group.props))

      return cssProps.map((prop: AppWidgetProp) => {
        return {[prop.id]: prop.value}
      })
    },
    argsProps(): { [k: string]: string } {
      let argsProps: AppWidgetProp[] = []

      this.propGroups
          .filter((group: { type: string }) => group.type === 'args')
          .forEach((group: { props: AppWidgetProp }) => argsProps = argsProps.concat(group.props))

      let argsObject: { [k: string]: string } = {}

      argsProps.forEach((prop: AppWidgetProp) => argsObject[prop.id] = prop.value)

      return argsObject
    },
    appWidget(): AppWidget {
      return this.widget as AppWidget
    }
  },
  methods: {
    setActive(widget: AppWidget) {
      this.$emit('activewidget', widget)
    }
  }
})
</script>

<style scoped>

</style>