<template>
  <div>
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
              :items="colValues"
              v-model="currentProp.value"
              item-color="accent">

            <template v-slot:item="{item}">
              <div class="text-start">{{ item }}</div>
            </template>

          </v-select>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'GuiEditorPropertyCols',
  props: {prop: Object},
  computed: {
    colValues(): string [] {
      return ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
    }
  },
  data() {
    return {
      currentProp: {}
    }
  },
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    }
  },
  watch: {
    prop() {
      this.currentProp = this.prop
    }
  },
  async beforeMount() {
    this.currentProp = this.prop
  }
})
</script>

<style scoped>

</style>