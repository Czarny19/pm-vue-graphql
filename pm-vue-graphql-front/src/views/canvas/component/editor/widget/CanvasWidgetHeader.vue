<template>
  <v-container fluid class="mb-2 secondary text-body-2 pa-2" @click="setActive(appWidget)">
    <v-row>
      <v-col class="text-start text-body-1 mt-auto mb-auto pl-4">
        {{ appWidget.id }} :: {{ appWidget.type }}
      </v-col>
      <v-col class="text-end pr-4">
        <v-btn fab x-small color="accent" class="mr-2" @click="move(false)">
          <v-icon size="30" color="primary">fa-caret-down</v-icon>
        </v-btn>

        <v-btn fab x-small color="accent" class="ml-2" @click="move(true)">
          <v-icon size="30" color="primary">fa-caret-up</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {AppWidget} from "@/plugins/types";

export default Vue.extend({
  name: 'CanvasWidgetHeader',
  props: {widget: Object},
  computed: {
    appWidget(): AppWidget {
      return this.widget as AppWidget
    }
  },
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    },
    setActive(widget: AppWidget): void {
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