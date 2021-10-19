<template>
  <v-app>
    <div id="app">
      <AppBar v-if="$route.name !== 'Login'"/>
      <router-view/>
    </div>
  </v-app>
</template>

<script>
import AppBar from "@/components/AppBar";

export default {
  name: 'App',
  components: {AppBar}
}
</script>

<style lang="scss">
@import "./assets/styles/main";
</style>
