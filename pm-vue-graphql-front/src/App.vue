<template>
  <v-app>
    <div id="app">
      <AppBar/>
      <v-main class="v-main">
        <router-view/>
      </v-main>
    </div>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import AppBar from "@/components/bar/AppBar.vue";

export default Vue.extend({
  name: 'App',
  components: {AppBar}
})

// TODO daty modyfikacji do poprawki | Cofanie w edytorach | Zapis, wczytanie, odrzuć zapytanie |  Nullable w typach pól | relacje
</script>

<style lang="scss">
@import "./assets/styles/main";
</style>
