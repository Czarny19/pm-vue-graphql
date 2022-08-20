<template>
  <v-slider
      class="pt-3"
      color="accent"
      :label="prop.label"
      dense hide-details thumb-label
      :min="prop.minValue"
      :max="prop.maxValue"
      v-model="currentProp.value">
  </v-slider>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'GuiEditorPropSlider',
  props: {
    prop: Object
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