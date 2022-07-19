<template>
  <v-container class="pa-0 pt-2 pb-2">
    <v-row>
      <v-col class="ma-auto pl-0 pr-0" cols="3">
        <div class="text-body-2">{{ prop.label }}:</div>
      </v-col>
      <v-col class="ml-1">
        <v-text-field color="accent" flat single-line dense hide-details v-model="currentProp.value"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'PropertyString',
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
}
</script>

<style scoped>

</style>