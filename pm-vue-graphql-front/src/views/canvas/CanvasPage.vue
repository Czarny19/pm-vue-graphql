<template>
  <div class="full-height">
    <CanvasMenu
        v-if="pageId === -1"
        :project="project"
        :theme="theme"
        :datasource="datasource"
        @openeditor="openEditor">
    </CanvasMenu>

    <CanvasEditor v-else :project="project" :theme="theme" :page-id="pageId" @closeeditor="closeEditor"/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import CanvasMenu from "@/views/canvas/component/menu/CanvasMenu.vue";
import CanvasEditor from "@/views/canvas/component/editor/CanvasEditor.vue";
import {CURRENT_USER} from "@/graphql/queries/user";
import {GET_PROJECT_BY_ID} from "@/graphql/queries/project";
import {GET_THEME_BY_ID} from "@/graphql/queries/theme";
import {GET_DATA_SOURCE_BY_ID} from "@/graphql/queries/data_source";

export default Vue.extend({
  name: 'CanvasPage',
  components: {CanvasEditor, CanvasMenu},
  data() {
    return {
      projectId: -1,
      pageId: -1,
      project: {},
      theme: {},
      datasource: {}
    }
  },
  methods: {
    openEditor(pageId: string): void {
      this.$router.push({name: 'Canvas', params: {projectId: this.projectId.toString(), pageId: pageId}})
      this.pageId = Number(pageId)
    },
    closeEditor(): void {
      this.$router.back()
      this.pageId = -1
    }
  },
  apollo: {
    currentUser: {
      query: CURRENT_USER
    },
    PROJECT: {
      query: GET_PROJECT_BY_ID,
      variables(): { id: number } {
        return {
          id: this.projectId
        }
      },
      skip(): boolean {
        return !this.currentUser
      },
      result({data}): void {
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
  },
  beforeMount() {
    this.projectId = Number(this.$route.params.projectId)
    this.pageId = this.$route.params.pageId ? Number(this.$route.params.pageId) : -1
  }
})
</script>

<style scoped>

</style>