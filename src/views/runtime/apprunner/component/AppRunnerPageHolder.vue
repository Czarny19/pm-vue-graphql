<template>
  <WidgetPage
      :widget="page.definition"
      :theme="theme"
      :datasource="datasource"
      :variables="variables"
      :mutations="mutations">
  </WidgetPage>
</template>

<script lang="ts">
import Vue from "vue";
import WidgetPage from "@/components/widget/grid/WidgetPage.vue";

export default Vue.extend({
  name: 'AppRunnerPageHolder',
  components: {WidgetPage},
  props: {
    page: Object,
    theme: Object,
    datasource: Object,
    variables: Array,
    mutations: Array
  }
})
</script>

<style scoped>

</style>