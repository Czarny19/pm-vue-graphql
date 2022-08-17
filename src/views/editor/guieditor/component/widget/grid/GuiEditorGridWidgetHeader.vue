<template>
  <v-container fluid class="pa-1 editor--widget-header" @click="setActive(appWidget)">
    <v-row>
      <v-col class="text-start text-body-2 text-pcolor mt-auto mb-auto pl-4">
        <b v-if="widget.id"> {{ appWidget.id }} :: {{ appWidget.label }}</b>
        <b v-else>{{ appWidget.label }}</b>
      </v-col>

      <v-col class="text-end pr-4">
        <v-btn fab width="18" height="18" color="transparent" elevation="0" class="ml-3" @click="move(false)">
          <v-icon size="18" color="primary">fa-caret-down</v-icon>
        </v-btn>

        <v-btn fab width="18" height="18" color="transparent" elevation="0" class="ml-3" @click="move(true)">
          <v-icon size="18" color="primary">fa-caret-up</v-icon>
        </v-btn>
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
    },
    move(up: boolean): void {
      this.$emit('move', up)
    },
    onDrop(): void {
      console.log("aaa")
    }
  }
})
</script>

<style scoped>

</style>