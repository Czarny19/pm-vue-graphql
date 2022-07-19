<template>
  <v-container class="pa-0 pt-2 pb-2">
    <v-row>
      <v-col class="ma-auto pl-0 pr-0" cols="3">
        <div class="text-body-2">{{ prop.label }}:</div>
      </v-col>
      <v-col class="ml-1">
        <v-text-field color="accent" flat single-line dense hide-details v-model="currentProp.value"/>
      </v-col>
      <v-col>
        <v-select
            class="pa-0"
            color="accent"
            outlined
            flat
            single-line
            dense
            hide-details
            append-icon=""
            :items="units"
            :value="currentProp.unit"
            v-model="currentProp.unit"
            item-color="accent">

          <template v-slot:item="{item}">
            <div class="text-start">{{ item }}</div>
          </template>

        </v-select>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'PropertySize',
  props: {
    prop: Object
  },
  computed: {
    units(): string [] {
      return ['px', '%', 'cm', 'pt', 'em', 'vw', 'vh', 'auto']
    }
  },
  data() {
    return {
      currentProp: {}
    }
  },
  watch: {
    unit() {
      const prop = (this.currentProp as { value: string; unit: string })
      if (prop.unit === 'auto') {
        prop.value = 'auto'
      } else {
        prop.value = '0'
      }
    }
  },
  async beforeMount() {
    this.currentProp = this.prop
  }
})
</script>

<style scoped>

</style>