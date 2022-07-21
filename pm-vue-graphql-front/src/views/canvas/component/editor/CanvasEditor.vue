<template>
  <div class="full-height">
    <LoadingDialog :dialog="saving" :title="i18n('canvas.saving')"/>

    <CanvasEditorRejectChanges :dialog="reject" @cancel="cancelRejectChanges" @confirm="rejectChanges"/>

    <CanvasEditorTopBar
        :project-name="project.name"
        :page-name="page.name"
        :page-definition="page.definition"
        :reject-visible="changesMade"
        :preview-open="previewOpen"
        @closeeditor="closeEditor"
        @swichpreview="switchPreview"
        @save="save"
        @reject="setRejectOpen"
        @import="importPage">
    </CanvasEditorTopBar>

    <LoadingCircular v-if="loading"/>

    <v-container v-else fluid class="pa-0" :style="{'height': `calc(100% - 64px)`}">
      <v-row class="fill-height" no-gutters>
        <v-col v-if="leftNavShown && !previewOpen" cols="3">
          <CanvasEditorLeftNav :page-definition="page.definition" @activewidget="setActiveWidget"/>
        </v-col>
        <v-col :cols="editorCols">
          <CanvasEditorDisplay
              :page-definition="page.definition"
              :theme="theme"
              :left-nav-shown="leftNavShown"
              :right-nav-shown="rightNavShown"
              :preview-open="previewOpen"
              @activewidget="setActiveWidget"
              @changeleftnav="changeLeftNavShown"
              @changerightnav="changeRightNavShown"
              @move="(up) => moveWidget(up, page.definition)">
          </CanvasEditorDisplay>
        </v-col>
        <v-col v-if="rightNavShown && !previewOpen" cols="2" class="text-end">
          <CanvasEditorRightNav :widget="activeWidget" :theme="theme" @delete="removeWidget(page.definition)"/>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import LoadingDialog from "@/components/dialog/LoadingDialog.vue";
import LoadingCircular from "@/components/loading/LoadingCircular.vue";
import CanvasEditorTopBar from "@/views/canvas/component/editor/display/CanvasEditorTopBar.vue";
import CanvasEditorLeftNav from "@/views/canvas/component/editor/display/CanvasEditorLeftNav.vue";
import CanvasEditorDisplay from "@/views/canvas/component/editor/display/CanvasEditorDisplay.vue";
import CanvasEditorRightNav from "@/views/canvas/component/editor/display/CanvasEditorRightNav.vue";
import CanvasEditorRejectChanges from "@/views/canvas/component/editor/display/CanvasEditorRejectChanges.vue";
import {GET_PAGE_BY_ID, UPDATE_PAGE_DEFINITION_BY_ID} from "@/graphql/queries/page";
import {AppWidget} from "@/plugins/types";

export default Vue.extend({
  name: 'CanvasEditor',
  components: {
    CanvasEditorRejectChanges,
    LoadingDialog,
    LoadingCircular,
    CanvasEditorRightNav,
    CanvasEditorDisplay,
    CanvasEditorLeftNav,
    CanvasEditorTopBar
  },
  props: {
    project: Object,
    theme: Object,
    pageId: Number
  },
  data() {
    return {
      loading: true,
      saving: false,
      reject: false,
      pageInitialized: false,
      changesMade: false,
      leftNavShown: true,
      rightNavShown: true,
      previewOpen: false,
      editorCols: 7,
      page: {},
      activeWidget: {}
    }
  },
  watch: {
    page: {
      handler() {
        if (!this.pageInitialized) {
          this.pageInitialized = true
          return
        }

        this.changesMade = true
      },
      deep: true
    }
  },
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    },
    setActiveWidget(widget: AppWidget): void {
      if (widget.type === 'Page') {
        (this.activeWidget as AppWidget | null) = null
        return
      }

      this.activeWidget = widget
    },
    closeEditor(): void {
      this.$emit('closeeditor')
    },
    switchPreview(): void {
      this.previewOpen = !this.previewOpen
      this.calcDisplayCols()
    },
    save(): void {
      this.saving = true

      this.$apollo.mutate({
        mutation: UPDATE_PAGE_DEFINITION_BY_ID,
        variables: {
          id: this.pageId,
          definition: (this.page as { definition: string }).definition
        }
      }).then(() => {
        this.changesMade = false
        this.saving = false
      })
    },
    setRejectOpen(): void {
      this.reject = true
    },
    cancelRejectChanges(): void {
      this.reject = false
    },
    rejectChanges(): void {
      this.reject = false
      this.pageInitialized = false
      this.changesMade = false
      this.loading = true

      this.$apollo.queries.PAGE.refetch()
    },
    changeLeftNavShown(): void {
      this.leftNavShown = !this.leftNavShown
      this.calcDisplayCols()
    },
    changeRightNavShown(): void {
      this.rightNavShown = !this.rightNavShown
      this.calcDisplayCols()
    },
    calcDisplayCols(): void {
      if (this.previewOpen) {
        this.editorCols = 12
        return
      }

      const leftCols = this.leftNavShown ? 3 : 0
      const rightCols = this.rightNavShown ? 2 : 0
      this.editorCols = 12 - leftCols - rightCols
    },
    removeWidget(parent: { children: [] }): void {
      parent.children.forEach((child, index) => {
        if (child == this.activeWidget) {
          parent.children.splice(index, 1)
          return
        }

        this.removeWidget(child)
      })
    },
    moveWidget(up: boolean, parent: { children: [] }): void {
      parent.children.forEach((child, index) => {
        if (child == this.activeWidget) {
          if (up && index != 0) {
            parent.children.splice(index, 1)
            parent.children.splice(index - 1, 0, child)
            return
          }

          if (!up && index != parent.children.length - 1) {
            parent.children.splice(index, 1)
            parent.children.splice(index + 1, 0, child)
            return
          }
        }

        this.moveWidget(up, child)
      })
    },
    importPage(importPage: JSON): void {
      (this.page as { definition: JSON }).definition = importPage
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