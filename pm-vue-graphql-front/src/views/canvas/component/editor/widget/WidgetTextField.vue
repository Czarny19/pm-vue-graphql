<template>
  <v-text-field @click.self="setActive(appWidget)" :label="widget.id"></v-text-field>
</template>

<script lang="ts">
import Vue from "vue";
import {AppWidget} from "@/plugins/types";

export default Vue.extend({
  name: 'WidgetTextField',
  props: {
    widget: Object
  },
  computed: {
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