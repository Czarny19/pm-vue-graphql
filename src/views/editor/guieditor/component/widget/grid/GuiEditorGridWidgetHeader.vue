<template>
  <v-container
      fluid
      class="pa-1 editor--widget-header"
      draggable="true"
      @click="setActive(appWidget)">
    <v-row>
      <v-col class="text-start text-body-2 text-pcolor mt-auto mb-auto pl-4">
        <b v-if="widget.id"> {{ appWidget.id }} :: {{ appWidget.label }}</b>
        <b v-else>{{ appWidget.label }}</b>
      </v-col>
    </v-row>
  </v-container>
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
      return this.widget as AppWidget
    }
  },
  methods: {
    setActive(widget: AppWidget): void {
      this.$emit('activewidget', widget)
    }
  }
})
</script>

<style scoped>

</style>