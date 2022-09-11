<template>
  <v-app>
    <div id="app-main">
      <AppBar v-if="isAdminPage"/>
      <v-main>
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
  components: {AppBar},
  computed: {
    isAdminPage(): boolean {
      return this.$route.path.startsWith('/admin');
    }
  }
})

// TODO dokończyć demo - 2 przykłady, komponent tabeli, napisać readme

// Runtime | walidacja danych | skomplikowany przypadek | celem nie jest prototyp tylko analiza zagadnienia | cech |
// funkc jako eksperyment + ocena wartości | celem jest ekesperyment! nie aplikacja
// Jako komercyjny produkt czy się nada | readme | komentarze
// Ciekawe przypadki jako el eksperymentu | sprawdzić na grupie osób
</script>

<style lang="scss">
@import "./assets/styles/main";
</style>
