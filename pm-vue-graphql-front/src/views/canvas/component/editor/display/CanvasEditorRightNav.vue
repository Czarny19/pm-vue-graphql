<template>
  <v-navigation-drawer permanent clipped right height="100%" width="100%" color="secondary">
    <v-container fluid class="primary pa-0">
      <v-row no-gutters>
        <v-col class="pa-1">
          <v-btn text block class="text-body-2 disable-events" @click.prevent>
            {{ i18n('canvas.design') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-divider></v-divider>

    <div>
      <v-container fluid class="pa-4">
        <v-row class="text-start" v-if="widget">
          <v-col class="mt-auto" cols="3">
            <div class="text-body-1">ID:</div>
          </v-col>
          <v-col>
            <v-text-field color="accent" flat single-line dense hide-details v-model="currentWidget.id"/>
          </v-col>
        </v-row>

        <v-row>
          <v-expansion-panels class="pa-1" multiple>
            <v-expansion-panel v-for="(group) in groups" :key="group.id">
              <v-expansion-panel-header class="primary text-start pt-0 pb-0 pl-4 pr-4" expand-icon="fa-angle-down">
                {{ group.label }}
              </v-expansion-panel-header>

              <v-expansion-panel-content class="pt-1 text-start">
                <template v-for="(prop) in group.props">
                  <PropertyString :key="prop.id" v-if="prop.type === 'String'" :prop="prop"/>
                  <PropertySize :key="prop.id" v-else-if="prop.type === 'Size'" :prop="prop"/>
                  <PropertyColor :key="prop.id" v-else-if="prop.type === 'Color'" :prop="prop" :theme="theme"/>
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
import PropertySize from "@/views/canvas/component/editor/property/PropertySize.vue";
import PropertyColor from "@/views/canvas/component/editor/property/PropertyColor.vue";

export default Vue.extend({
  name: 'CanvasEditorRightNav',
  components: {PropertyColor, PropertySize, PropertyString},
  props: {
    widget: Object,
    theme: Object
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
    }
  }
})
</script>

<style scoped>

</style>