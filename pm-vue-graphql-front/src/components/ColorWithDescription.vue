<template>
  <v-container class="pt-1 pb-1 pl-0 pr-0">
    <v-row no-gutters>
      <v-col class="text-left">
        {{ description }}
      </v-col>
      <v-col class="ma-auto" cols="auto">
        <div class="color-square" :style="{'background-color': color}"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'ColorWithDescription',
  props: {
    color: String,
    description: String
  }
}
</script>

<style scoped>

</style>