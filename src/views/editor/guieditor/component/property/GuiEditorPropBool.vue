<template>
  <v-checkbox
      class="pb-1"
      color="accent"
      off-icon="fa-times-circle"
      on-icon="fa-check-circle"
      hide-details
      :label="prop.label"
      v-model="currentProp.value"
  />
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
    this.currentProp = this.prop;
  }
})
</script>

<style scoped>

</style>