<template>
  <v-select
      class="pt-3"
      color="accent"
      outlined dense hide-details
      :label="prop.label"
      :items="borders"
      v-model="currentProp.value"
      item-color="accent">
  </v-select>
</template>

<script lang="ts">
import Vue from "vue";
import {borders} from "@/lib/widget";

export default Vue.extend({
  name: 'GuiEditorPropBorder',
  props: {
    prop: Object
  },
  computed: {
    borders(): string [] {
      return borders
    }
  },
  data() {
    return {
      currentProp: {}
    }
  },
  beforeMount() {
    this.currentProp = this.prop
  }
})
</script>

<style scoped>

</style>