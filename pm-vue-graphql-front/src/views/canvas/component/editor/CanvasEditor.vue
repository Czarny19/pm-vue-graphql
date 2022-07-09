<template>
  <div>
    <CanvasEditorTopBar :project-name="project.name" :page-name="page.name" @closeeditor="closeEditor"/>

    <LoadingCircular v-if="loading"/>

    <v-container v-else fluid class="pa-0">
      <v-row no-gutters>
        <v-col cols="3">
          <CanvasEditorLeftNav :page-definition="page.definition" @activewidget="setActiveWidget"/>
        </v-col>
        <v-col cols="7">
          <CanvasEditorDisplay :page-definition="page.definition" @activewidget="setActiveWidget"/>
        </v-col>
        <v-col cols="2" class="text-end">
          <CanvasEditorRightNav :widget="activeWidget" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import CanvasEditorTopBar from "@/views/canvas/component/editor/display/CanvasEditorTopBar.vue";
import CanvasEditorLeftNav from "@/views/canvas/component/editor/display/CanvasEditorLeftNav.vue";
import CanvasEditorDisplay from "@/views/canvas/component/editor/display/CanvasEditorDisplay.vue";
import CanvasEditorRightNav from "@/views/canvas/component/editor/display/CanvasEditorRightNav.vue";
import LoadingCircular from "@/components/loading/LoadingCircular.vue";
import {GET_PAGE_BY_ID} from "@/graphql/queries/page";
import {AppWidget} from "@/plugins/types";

export default Vue.extend({
  name: 'CanvasEditor',
  components: {LoadingCircular, CanvasEditorRightNav, CanvasEditorDisplay, CanvasEditorLeftNav, CanvasEditorTopBar},
  props: {
    project: Object,
    pageId: Number
  },
  data() {
    return {
      loading: true,
      page: {},
      activeWidget: {}
    }
  },
  methods: {
    setActiveWidget(widget: AppWidget): void {
      this.activeWidget = widget
    },
    closeEditor(): void {
      this.$emit('closeeditor')
    }
  },
  apollo: {
    PAGE: {
      query: GET_PAGE_BY_ID,
      fetchPolicy: 'network-only',
      variables(): { id: number } {
        return {
          id: this.pageId
        }
      },
      skip(): boolean {
        return !this.pageId
      },
      result({data}): void {
        this.page = data.PAGE[0]
        this.loading = false
      }
    }
  }
})
</script>

<style scoped>

</style>