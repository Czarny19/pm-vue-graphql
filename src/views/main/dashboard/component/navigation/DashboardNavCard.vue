<template>
  <v-card color="primary" class="pa-2 fill-height" @click="onClick">
    <v-container fluid class="fill-height">
      <v-row>
        <v-col cols="auto">
          <v-avatar size="52" color="accent">
            <v-icon color="secondary">{{ icon }}</v-icon>
          </v-avatar>
        </v-col>
        <v-col>
          <div class="text-h6 text-start">{{ title }}</div>
          <div class="text-body-2 text-start">{{ subTitle }}</div>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'DashboardNavCard',
  props: {
    title: String,
    subTitle: String,
    icon: String,
    onClick: Function
  }
})
</script>

<style scoped>

</style>