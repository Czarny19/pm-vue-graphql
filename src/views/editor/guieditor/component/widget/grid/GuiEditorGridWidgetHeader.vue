<template>
  <v-card
      class="pa-2 pl-3 text-start"
      color="secondary"
      width="100%"
      :ripple="false"
      @click="setActive(appWidget)"
  >
    <span v-if="widget.id"> {{ appWidget.id }} :: {{ appWidget.label }}</span>
    <span v-else>{{ appWidget.label }}</span>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import {AppWidget} from "@/lib/types";

export default Vue.extend({
  name: 'GuiEditorGridWidgetHeader',
  props: {
    widget: Object
  },
  computed: {
    appWidget(): AppWidget {
      return this.widget as AppWidget;
    }
  },
  methods: {
    setActive(widget: AppWidget): void {
      this.$emit('activewidget', widget);
    }
  }
})
</script>

<style scoped>

</style>