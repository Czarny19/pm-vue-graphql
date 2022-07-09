<template>
  <div>
    <v-container class="pa-0 pt-2 pb-2">
      <v-row>
        <v-col class="ma-auto pl-0" cols="4">
          <div class="canvas__editor--prop-label">{{ label }}:</div>
        </v-col>
        <v-col class="pa-2 canvas__editor--prop-text-field">
          <v-text-field outlined flat single-line hide-details v-model="currentProp.value" height="30"></v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'PropertyString',
  props: {
    prop: Object,
    label: String
  },
  data() {
    return {
      currentProp: {}
    }
  },
  async beforeMount() {
    this.currentProp = this.prop
  }
}
</script>

<style scoped>

</style>