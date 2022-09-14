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
</script>

<style lang="scss">
@import "./assets/styles/main";
</style>
