<template>
  <div class="mt-2 mb-2 secondary" @click="setActive(appWidget)">
    <v-container>
      <v-row>
        <v-col class="text-start text-body-2 mt-auto mb-auto pl-4">
          <span v-if="widget.id"> {{ appWidget.id }} :: {{ appWidget.label }}</span>
          <span v-else>{{ appWidget.label }}</span>
        </v-col>

        <v-col class="text-end pr-4">
          <v-btn fab width="18" height="18" color="accent" elevation="0" class="ml-3" @click="move(false)">
            <v-icon size="18" color="primary">fa-caret-down</v-icon>
          </v-btn>

          <v-btn fab width="18" height="18" color="accent" elevation="0" class="ml-3" @click="move(true)">
            <v-icon size="18" color="primary">fa-caret-up</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {AppWidget} from "@/lib/types";

export default Vue.extend({
  name: 'GuiEditorWidgetOther',
  props: {widget: Object},
  computed: {
    appWidget(): AppWidget {
      return this.widget as AppWidget
    }
  },
  methods: {
    setActive(widget: AppWidget) {
      this.$emit('activewidget', widget)
    },
    move(up: boolean): void {
      this.$emit('move', up)
    }
  }
})
</script>

<style scoped>

</style>