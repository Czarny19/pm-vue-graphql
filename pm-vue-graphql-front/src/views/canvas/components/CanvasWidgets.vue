<template>
  <div class="canvas__editor--toolbox">
    <div class="canvas__editor--toolbox-title text-left">
      <v-icon small class="pr-4 pb-1">fa-toolbox</v-icon>
      {{ $t('canvas.components') }}
    </div>

    <div>
      <v-container fluid class="pa-0">
        <v-row no-gutters>
          <template v-for="(widget) in widgets">
            <v-col cols="12" sm="12" md="12" lg="6" xl="6" :key="widget.title">
              <v-card
                  class="ma-2 canvas__editor--toolbox-widget"
                  draggable="true"
                  @dragstart='startDrag($event, widget)'>

                <v-container>
                  <v-row>
                    <v-col class="pa-2" cols="12">
                      <v-icon class="ma-auto" small>{{ widget.icon }}</v-icon>
                    </v-col>
                    <v-col class="pb-2 pt-0" cols="12">
                      {{ widget.title }}
                    </v-col>
                  </v-row>
                </v-container>

              </v-card>
            </v-col>
          </template>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import widgets from "@/config/widgets.json";

export default {
  name: 'CanvasWidgets',
  data() {
    return {
      widgetIndex: 1,
    }
  },
  computed: {
    widgets() {
      return widgets.widgets.filter((widget) => widget.title !== 'Page')
    }
  },
  methods: {
    startDrag(evt, widget) {
      widget.id = `el${this.widgetIndex++}`

      evt.dataTransfer.dropEffect = 'move'
      evt.dataTransfer.effectAllowed = 'move'
      evt.dataTransfer.setData('widget', JSON.stringify(widget))
    }
  }
}
</script>

<style scoped>

</style>