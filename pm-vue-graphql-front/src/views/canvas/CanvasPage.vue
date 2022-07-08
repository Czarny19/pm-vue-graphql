<template>
  <div>
    <CanvasMenu
        v-if="pageId === -1"
        :project="project"
        :theme="theme"
        :datasource="datasource"
        @openeditor="openEditor">
    </CanvasMenu>

    <template v-else>
      <CanvasTopBar :project="project"/>

      <v-container fluid class="pa-0">
        <v-row no-gutters>
          <v-col cols="2">
            <CanvasWidgets/>
          </v-col>
          <v-col cols="8">
            <CanvasDisplay :current-page="currentPage" @setActive="setActive"/>
          </v-col>
          <v-col cols="2">
            <CanvasProperties :widget="activeWidget"/>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import CanvasTopBar from "@/views/canvas/components/editor/CanvasTopBar.vue";
import CanvasWidgets from "@/views/canvas/components/editor/CanvasWidgets.vue";
import CanvasDisplay from "@/views/canvas/components/editor/CanvasDisplay.vue";
import CanvasProperties from "@/views/canvas/components/editor/CanvasProperties.vue";
import CanvasMenu from "@/views/canvas/components/menu/CanvasMenu.vue";
import {CURRENT_USER} from "@/graphql/queries/user";
import {GET_PROJECT_BY_ID} from "@/graphql/queries/project";
import {GET_THEME_BY_ID} from "@/graphql/queries/theme";
import {GET_DATA_SOURCE_BY_ID} from "@/graphql/queries/data_source";

export default Vue.extend({
  name: 'CanvasPage',
  components: {CanvasMenu, CanvasProperties, CanvasDisplay, CanvasWidgets, CanvasTopBar},
  data() {
    return {
      project: {},
      theme: {},
      datasource: {},
      activeWidget: {},
      pageId: -1
    }
  },
  computed: {
    currentPage() {
      return {
        id: 'el0',
        title: 'Page',
        children: []
      }
    }
  },
  methods: {
    setActive(widget: any) {
      this.activeWidget = widget
    },
    openEditor(pageId: number): void {
      this.pageId = pageId
    }
  },
  apollo: {
    currentUser: {
      query: CURRENT_USER
    },
    PROJECT: {
      query: GET_PROJECT_BY_ID,
      variables() {
        return {
          id: this.$route.params.projectId
        }
      },
      skip() {
        return !this.currentUser
      },
      result({data}) {
        this.project = data.PROJECT[0]
      },
    },
    THEME: {
      query: GET_THEME_BY_ID,
      fetchPolicy: 'network-only',
      variables(): { id: number } {
        return {
          id: this.project.theme_id
        }
      },
      skip(): boolean {
        return !this.project.theme_id
      },
      result({data}): void {
        this.theme = data.THEME[0]
      }
    },
    DATA_SOURCE: {
      query: GET_DATA_SOURCE_BY_ID,
      fetchPolicy: 'network-only',
      variables(): { id: number } {
        return {
          id: this.project.source_id
        }
      },
      skip(): boolean {
        return !this.project.source_id
      },
      result({data}): void {
        this.datasource = data.DATA_SOURCE[0]
      }
    }
  }
})
</script>

<style scoped>

</style>