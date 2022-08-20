<template>
  <v-select
      class="pt-3"
      color="accent"
      item-color="accent"
      outlined dense hide-details
      item-text="name"
      item-value="id"
      :label="prop.label"
      :items="currentProp.list"
      v-model="currentProp.value">

    <template v-slot:item="{item}">
      <div class="text-start">{{ item.name }}</div>
    </template>

  </v-select>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'GuiEditorPropSelect',
  props: {
    prop: Object
  },
  data() {
    return {
      currentProp: {}
    }
  },
  async beforeMount() {
    this.currentProp = this.prop
  }
})
</script>

<style scoped>

</style>