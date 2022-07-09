<template>
  <v-navigation-drawer permanent clipped right height="90vh" width="100%" color="secondary">
    <v-container fluid class="primary pa-0">
      <v-row no-gutters>
        <v-col class="pa-1">
          <v-btn text block class="text-body-2 disable-events" @click.prevent>
            {{ i18n('canvas.property') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-divider></v-divider>

    <div>
      <v-container fluid class="pa-4">
        <v-row class="text-start" v-if="widget">
          <v-col class="ma-auto pa-2" cols="4">
            <div class="canvas__editor--id-label">{{ $t('prop.id') }}:</div>
          </v-col>
          <v-col class="pa-2 canvas__editor--id-text-field">
            <v-text-field outlined flat single-line hide-details v-model="currentWidget.id" height="30"></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-expansion-panels class="pa-1" multiple>
            <v-expansion-panel  v-for="(group) in groups" :key="group.id">
              <v-expansion-panel-header class="primary text-start pt-0 pb-0 pl-4 pr-4" expand-icon="fa-angle-down">
                {{ mapIdToLabel(group.id) }}
              </v-expansion-panel-header>

              <v-expansion-panel-content class="pt-1 text-start">
                <template v-for="(prop) in group.props">
                  <PropertyString
                      :key="prop.id"
                      v-if="prop.dataType === 'String'"
                      :prop="prop"
                      :label="mapIdToLabel(prop.id)">
                  </PropertyString>
                </template>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-row>
      </v-container>
    </div>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from "vue";
import PropertyString from "@/views/canvas/component/editor/property/PropertyString.vue";

export default Vue.extend({
  name: 'CanvasEditorRightNav',
  components: {PropertyString},
  props: {
    widget: Object
  },
  data() {
    return {
      currentWidget: {}
    }
  },
  computed: {
    id() {
      return this.widget ? this.widget.id : ''
    },
    groups() {
      return this.widget ? this.widget.propGroups : []
    }
  },
  watch: {
    widget(): void {
      this.currentWidget = this.widget
    }
  },
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    },
    mapIdToLabel(id) {
      switch (id) {
        case 'colors':
          return this.$t('prop.colors')
        case 'paddings':
          return this.$t('prop.paddings')
        case 'margins':
          return this.$t('prop.margins')
        case 'dimensions':
          return this.$t('prop.dimensions')
        case 'background-color' :
          return this.$t('prop.bgColor')
        case 'padding-top':
          return this.$t('prop.pdTop')
        case 'padding-bottom':
          return this.$t('prop.pdBot')
        case 'padding-left':
          return this.$t('prop.pdLeft')
        case 'padding-right':
          return this.$t('prop.pdRight')
        case 'height':
          return this.$t('prop.height')
        case 'min-height':
          return this.$t('prop.minHeigth')
        case 'margin-top':
          return this.$t('prop.mrTop')
        case 'margin-bottom':
          return this.$t('prop.mrBot')
        case 'margin-left':
          return this.$t('prop.mrLeft')
        case 'margin-right':
          return this.$t('prop.mrRight')
        case 'border':
          return this.$t('prop.border')
        case 'border-top':
          return this.$t('prop.borderTop')
        case 'border-bottom':
          return this.$t('prop.borderBot')
        case 'border-left':
          return this.$t('prop.borderLeft')
        case 'border-right':
          return this.$t('prop.borderRight')
        default:
          return id
      }
    }
  }
})
</script>

<style scoped>

</style>