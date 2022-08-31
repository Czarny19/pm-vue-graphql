<template>
  <v-container class="pa-0">
    <v-row>
      <v-col cols="9">
        <v-text-field
            class="pt-3"
            color="accent"
            outlined dense hide-details
            :label="prop.label"
            v-model="currentProp.value"
            @keydown="filterNumbersOnly">
        </v-text-field>
      </v-col>

      <v-col cols="3" class="pl-0">
        <v-text-field
            class="pt-3"
            color="accent"
            outlined dense hide-details
            value="ms"
            readonly>
        </v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {filterNumbersOnly} from "@/lib/filters";

export default Vue.extend({
  name: 'GuiEditorPropDuration',
  props: {
    prop: Object
  },
  data() {
    return {
      currentProp: {}
    }
  },
  methods: {
    filterNumbersOnly(event: KeyboardEvent) {
      filterNumbersOnly(event)
    }
  },
  async beforeMount() {
    this.currentProp = this.prop
  }
})
</script>

<style scoped>

</style>