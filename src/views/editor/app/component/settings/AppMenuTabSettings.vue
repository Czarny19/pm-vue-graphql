<template>
  <v-container fluid class="pa-3">
    <LoadingCircular v-if="loading"/>

    <template v-else>
      <AppMenuSettingStartPage :project="project" :pages="pages"/>
      <AppMenuSettingNav :project="project" :pages="pages"/>
    </template>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import LoadingCircular from "@/components/loading/LoadingCircular.vue";
import AppMenuSettingStartPage from "@/views/editor/app/component/settings/AppMenuSettingStartPage.vue";
import AppMenuSettingNav from "@/views/editor/app/component/settings/AppMenuSettingNav.vue";

export default Vue.extend({
  name: 'AppMenuTabSettings',
  components: {AppMenuSettingNav, AppMenuSettingStartPage, LoadingCircular},
  props: {
    loading: Boolean,
    project: Object,
    pages: Array
  }
})
</script>

<style scoped>

</style>