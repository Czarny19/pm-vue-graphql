<template>
  <v-container class="pa-0 pt-2 pb-2">
    <v-row>
      <v-col class="ma-auto pl-0 pr-0" cols="3">
        <div class="text-body-2">{{ prop.label }}:</div>
      </v-col>
      <v-col cols="9">
        <v-select
            class="pa-0"
            color="accent"
            outlined
            flat
            single-line
            dense
            hide-details
            append-icon=""
            :items="borders"
            v-model="currentProp.value"
            item-color="accent">
        </v-select>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'GuiEditorPropertyBorder',
  props: {
    prop: Object
  },
  computed: {
    borders(): string [] {
      return ['dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'none', 'hidden']
    }
  },
  data() {
    return {
      currentProp: {}
    }
  },
  watch: {
    prop() {
      this.currentProp = this.prop
    }
  },
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    }
  },
  async beforeMount() {
    this.currentProp = this.prop
  }
})
</script>

<style scoped>

</style>