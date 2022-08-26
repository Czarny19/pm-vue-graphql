<template>
  <v-text-field
      class="pt-3"
      color="accent"
      outlined dense hide-details
      :label="prop.label"
      v-model="currentProp.value"
      @keydown="onKeydown">
  </v-text-field>
</template>

<script lang="ts">
import { filterNumbersOnly } from "@/lib/filters";
import Vue from "vue";

export default Vue.extend({
  name: 'GuiEditorPropNumber',
  props: {
    prop: Object
  },
  data() {
    return {
      currentProp: {}
    }
  },
  methods: {
    onKeydown(event: KeyboardEvent) {
      filterNumbersOnly(event)
    }
  },
  beforeMount() {
    this.currentProp = this.prop
  }
})
</script>

<style scoped>

</style>