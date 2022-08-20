<template>
  <v-checkbox
      color="accent"
      value="accent"
      off-icon="fa-times-circle"
      on-icon="fa-check-circle"
      hide-details
      :label="prop.label"
      v-model="currentProp.value"
  ></v-checkbox>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'GuiEditorPropBool',
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