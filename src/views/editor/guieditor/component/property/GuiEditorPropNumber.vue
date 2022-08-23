<template>
  <v-text-field
      class="pt-3"
      color="accent"
      type="number"
      outlined dense hide-details
      :label="prop.label"
      v-model="currentProp.value">
  </v-text-field>
</template>

<script lang="ts">
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
  beforeMount() {
    this.currentProp = this.prop
  }
})
</script>

<style scoped>

</style>