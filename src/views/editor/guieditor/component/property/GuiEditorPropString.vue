<template>
  <v-textarea
      class="pt-3"
      color="accent"
      outlined dense hide-details
      :rows="2"
      :label="prop.label"
      v-model="currentProp.value"
  />
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
    this.currentProp = this.prop;
  }
})
</script>

<style scoped>

</style>