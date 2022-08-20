<template>
  <v-textarea
      class="pt-3"
      color="accent"
      outlined dense hide-details

      :label="prop.label"
      v-model="currentProp.value">
  </v-textarea>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'GuiEditorPropString',
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