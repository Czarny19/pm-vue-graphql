<template>
  <v-select
      class="pt-3"
      color="accent"
      item-color="accent"
      outlined dense hide-details
      item-text="name"
      item-value="id"
      :label="prop.label"
      :items="['', ...variables]"
      v-model="currentProp.value"
  />
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'GuiEditorPropVar',
  props: {
    prop: Object,
    variables: Array
  },
  data() {
    return {
      currentProp: {}
    }
  },
  async beforeMount() {
    this.currentProp = this.prop;
  }
})
</script>

<style scoped>

</style>