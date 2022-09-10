<template>
  <v-select
      class="pt-3"
      color="accent"
      item-color="accent"
      outlined dense hide-details
      item-text="name"
      item-value="id"
      :label="prop.label"
      :items="['', ...params]"
      v-model="currentProp.value"
  />
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'GuiEditorPropParam',
  props: {
    prop: Object,
    page: Object
  },
  data() {
    return {
      currentProp: {}
    }
  },
  computed: {
    params(): string[] {
      return this.page.params.split(';');
    }
  },
  async beforeMount() {
    this.currentProp = this.prop;
  }
})
</script>

<style scoped>

</style>