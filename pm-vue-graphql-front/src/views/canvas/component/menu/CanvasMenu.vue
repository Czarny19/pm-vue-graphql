<template>
  <div>
    <CanvasMenuNavigation @tabchange="changeTab"/>

    <CanvasMenuInfo :project="project" :theme-name="theme.name" :datasource-name="datasource.name"/>

    <v-divider></v-divider>

    <CanvasMenuTabPages v-if="currentTab === 0" :project-id="project.id" @openeditor="openEditor"/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import CanvasMenuNavigation from "@/views/canvas/component/menu/CanvasMenuNavigation.vue";
import CanvasMenuTabPages from "@/views/canvas/component/menu/page/CanvasMenuTabPages.vue";
import CanvasMenuInfo from "@/views/canvas/component/menu/CanvasMenuInfo.vue";

export default Vue.extend({
  name: 'CanvasMenu',
  components: {CanvasMenuInfo, CanvasMenuTabPages, CanvasMenuNavigation},
  props: {
    project: Object,
    theme: Object,
    datasource: Object
  },
  data() {
    return {
      currentTab: 0
    }
  },
  methods: {
    changeTab(tab: number): void {
      this.currentTab = tab
    },
    openEditor(pageId: number): void {
      this.$emit('openeditor', pageId)
    }
  }
})
</script>

<style scoped>

</style>