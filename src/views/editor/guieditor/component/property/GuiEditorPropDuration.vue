<template>
  <v-container class="pa-0">
    <v-row>
      <v-col cols="10">
        <v-text-field
            class="pt-3"
            color="accent"
            type="number"
            outlined dense hide-details
            :label="prop.label"
            v-model="currentProp.value">
        </v-text-field>
      </v-col>

      <v-col cols="2" class="pl-0">
        <v-text-field
            class="pt-3"
            color="accent"
            outlined dense hide-details
            value="ms"
            readonly>
        </v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'GuiEditorPropDuration',
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