<template>
  <v-container fluid class="pa-3">
    <LoadingCircular v-if="loading"/>

    <template v-else>
      <AppMenuSettingRunning :project="project"/>
      <AppMenuSettingStartPage class="mt-3" :project="project" :pages="pages"/>
      <AppMenuSettingNav class="mt-3" :project="project" :pages="pages"/>
    </template>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import LoadingCircular from "@/components/loading/LoadingCircular.vue";
import AppMenuSettingStartPage from "@/views/editor/app/component/settings/AppMenuSettingStartPage.vue";
import AppMenuSettingNav from "@/views/editor/app/component/settings/AppMenuSettingNav.vue";
import AppMenuSettingRunning from "@/views/editor/app/component/settings/AppMenuSettingRunning.vue";

export default Vue.extend({
  name: 'AppMenuTabSettings',
  components: {AppMenuSettingRunning, AppMenuSettingNav, AppMenuSettingStartPage, LoadingCircular},
  props: {
    loading: Boolean,
    project: Object,
    pages: Array
  }
})
</script>

<style scoped>

</style>