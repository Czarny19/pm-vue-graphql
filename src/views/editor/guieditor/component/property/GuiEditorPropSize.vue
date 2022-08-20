<template>
  <v-container class="pa-0">
    <v-row>
      <v-col cols="9">
        <v-text-field
            class="pt-3"
            color="accent"
            outlined dense hide-details
            :readonly="currentProp.unit === 'auto'"
            :label="prop.label"
            v-model="currentProp.value">
        </v-text-field>
      </v-col>

      <v-col cols="3" class="pl-0">
        <v-select
            class="pt-3"
            color="accent"
            outlined dense hide-details single-line
            append-icon=""
            :items="units"
            :value="currentProp.unit"
            v-model="currentProp.unit"
            item-color="accent">

          <template v-slot:item="{item}">
            <div class="text-start">{{ item }}</div>
          </template>

        </v-select>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {sizeUnits} from "@/lib/widget";

export default Vue.extend({
  name: 'GuiEditorPropSize',
  props: {
    prop: Object
  },
  data() {
    return {
      currentProp: {}
    }
  },
  computed: {
    units(): string [] {
      return sizeUnits
    }
  },
  watch: {
    prop: {
      handler() {
        this.currentProp = this.prop

        const prop = (this.currentProp as { value: string; unit: string })

        if (prop.unit === 'auto') {
          prop.value = 'auto'
        } else if (prop.value === 'auto') {
          prop.value = '0'
        }
      },
      deep: true
    }
  },
  async beforeMount() {
    this.currentProp = this.prop
  }
})
</script>

<style scoped>

</style>