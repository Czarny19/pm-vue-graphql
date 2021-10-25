<template>
  <v-app>
    <div id="app">
      <AppBar v-if="$route.name !== 'Login'"/>
      <router-view/>
      <PageFooter/>
    </div>
  </v-app>
</template>

<script>
import AppBar from "@/components/AppBar";
import PageFooter from "@/components/PageFooter";

export default {
  name: 'App',
  components: {PageFooter, AppBar}
}
</script>

<style lang="scss">
@import "./assets/styles/main";
</style>
