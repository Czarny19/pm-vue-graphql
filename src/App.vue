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

// TODO Nullable w typach pól | relacje

// Runtime | walidacja danych | skomplikowany przypadek | celem nie jest prototyp tylko analiza zagadnienia | cech |
// funkc jako eksperyment + ocena wartości | celem jest ekesperyment! nie aplikacja
// Jako komercyjny produkt czy się nada | readme | komentarze
// Ciekawe przypadki jako el eksperymentu
</script>

<style lang="scss">
@import "./assets/styles/main";
</style>
