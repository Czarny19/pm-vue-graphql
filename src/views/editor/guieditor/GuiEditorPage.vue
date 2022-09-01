<template>
  <div class="full-height">
    <LoadingDialog :dialog="saving" :title="i18n('editor.saving')"/>

    <RejectChangesDialog :dialog="reject" @cancel="cancelRejectChanges" @confirm="rejectChanges"/>

    <GuiEditorTopBar
        v-if="page"
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
    </GuiEditorTopBar>

    <LoadingCircular v-if="loading"/>

    <v-container v-else fluid class="pa-0" :style="{'height': `calc(100% - 60px)`}">
      <v-row class="fill-height" no-gutters>
        <v-col v-if="leftNavShown && !previewOpen" cols="2">
          <GuiEditorLeftNav :page-definition="page.definition" @activewidget="setActiveWidget"/>
        </v-col>

        <v-col :cols="editorCols">
          <GuiEditorDisplay
              :page-definition="page.definition"
              :theme="theme"
              :left-nav-shown="leftNavShown"
              :right-nav-shown="rightNavShown"
              :preview-open="previewOpen"
              :datasource="datasource"
              :variables="variables"
              @activewidget="setActiveWidget"
              @changeleftnav="changeLeftNavShown"
              @changerightnav="changeRightNavShown"
              @move="(up) => moveWidget(up, page.definition)">
          </GuiEditorDisplay>
        </v-col>

        <v-col v-if="rightNavShown && !previewOpen" cols="2" class="text-end">
          <GuiEditorRightNav
              :widget="activeWidget"
              :theme="theme"
              :queries="queries"
              :mutations="mutations"
              :schema="schema"
              :variables="variables"
              :page="page"
              :pages="pages"
              :params="pageParams"
              @delete="removeWidget(page.definition)"
              @refreshvars="refreshVars">
          </GuiEditorRightNav>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import LoadingDialog from "@/components/dialog/LoadingDialog.vue";
import LoadingCircular from "@/components/loading/LoadingCircular.vue";
import GuiEditorTopBar from "@/views/editor/guieditor/component/display/GuiEditorTopBar.vue";
import GuiEditorLeftNav from "@/views/editor/guieditor/component/display/GuiEditorLeftNav.vue";
import GuiEditorDisplay from "@/views/editor/guieditor/component/display/GuiEditorDisplay.vue";
import GuiEditorRightNav from "@/views/editor/guieditor/component/display/GuiEditorRightNav.vue";
import RejectChangesDialog from "@/components/dialog/RejectChangesDialog.vue";
import {GET_PAGE_LIST_BY_PROJECT_ID, UPDATE_PAGE_DEFINITION} from "@/graphql/queries/page";
import {CURRENT_USER} from "@/graphql/queries/user";
import {GET_PROJECT_BY_ID} from "@/graphql/queries/project";
import {GET_THEME_BY_ID} from "@/graphql/queries/theme";
import {GET_QUERY_LIST_BY_DATA_SOURCE_ID} from "@/graphql/queries/query";
import {GET_DATA_SOURCE_BY_ID} from "@/graphql/queries/datasource";
import {GET_PROP_LIST_BY_PAGE_ID} from "@/graphql/queries/prop";
import {GET_EXT_MUTATION_LIST_BY_DATA_SOURCE_ID} from "@/graphql/queries/mutation";
import {AppWidget, Page} from "@/lib/types";
import {decodeDatasourceSecret, getCleanGraphQLSchema} from "@/lib/schema";

export default Vue.extend({
  name: 'GuiEditorPage',
  components: {
    LoadingDialog,
    LoadingCircular,
    GuiEditorTopBar,
    GuiEditorLeftNav,
    GuiEditorDisplay,
    GuiEditorRightNav,
    RejectChangesDialog
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
      isClosing: false,
      editorCols: 8,
      project: {},
      theme: {},
      activeWidget: {},
      datasource: {},
      variables: [],
      queries: [],
      mutations: [],
      pages: [],
      schema: []
    }
  },
  computed: {
    projectId(): number {
      return Number(this.$route.params.projectId)
    },
    pageId(): number {
      return Number(this.$route.params.pageId)
    },
    datasourceId(): number {
      return Number(this.$route.params.datasourceId)
    },
    page(): Page {
      return (this.pages as Page[]).filter((page) => page.id == this.pageId)[0]
    },
    pageParams(): string[] {
      return this.page.params.length ? this.page.params.split(';') : []
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
    setActiveWidget(widget: AppWidget): void {
      (this.activeWidget as AppWidget | null) = null

      if (widget.type === 'Page') {
        return
      }

      this.activeWidget = widget
    },
    switchPreview(): void {
      this.previewOpen = !this.previewOpen
      this.activeWidget = {}
      this.calcDisplayCols()
    },
    save(): void {
      this.saving = true

      this.$apollo.mutate({
        mutation: UPDATE_PAGE_DEFINITION,
        variables: {
          id: this.pageId,
          definition: this.page.definition,
          modifyDate: new Date(),
          params: this.pageParams.join(';')
        }
      }).then(() => {
        this.changesMade = false
        this.saving = false
      })
    },
    closeEditor(): void {
      if (this.changesMade) {
        this.isClosing = true
        this.setRejectOpen()
        return
      }

      this.$router.back()
    },
    setRejectOpen(): void {
      this.reject = true
    },
    cancelRejectChanges(): void {
      this.isClosing = false
      this.reject = false
    },
    rejectChanges(): void {
      this.reject = false
      this.pageInitialized = false
      this.changesMade = false
      this.loading = true

      if (this.isClosing) {
        this.$router.back()
        return
      }

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

      const leftCols = this.leftNavShown ? 2 : 0
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
      // TODO
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
    },
    refreshVars(): void {
      this.$apollo.queries.PROP.refetch()
    }
  },
  apollo: {
    currentUser: {
      query: CURRENT_USER
    },
    PROJECT: {
      query: GET_PROJECT_BY_ID,
      fetchPolicy: 'no-cache',
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
      fetchPolicy: 'no-cache',
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
    PAGE: {
      query: GET_PAGE_LIST_BY_PROJECT_ID,
      fetchPolicy: 'no-cache',
      variables(): { projectId: number } {
        return {
          projectId: this.projectId
        }
      },
      skip(): boolean {
        return !this.projectId
      },
      result({data}): void {
        this.pages = data.PAGE
        this.loading = false
      }
    },
    PROP: {
      query: GET_PROP_LIST_BY_PAGE_ID,
      fetchPolicy: 'no-cache',
      variables(): { pageId: number } {
        return {
          pageId: this.pageId
        }
      },
      skip(): boolean {
        return !this.pageId
      },
      result({data}): void {
        this.variables = data.PROP
      }
    },
    DATA_SOURCE: {
      query: GET_DATA_SOURCE_BY_ID,
      fetchPolicy: 'no-cache',
      variables(): { id: number } {
        return {
          id: this.datasourceId
        }
      },
      skip(): boolean {
        return !this.datasourceId
      },
      async result({data}): Promise<void> {
        this.datasource = data.DATA_SOURCE[0]
        this.datasource.secret = decodeDatasourceSecret(data.DATA_SOURCE[0].secret)

        await getCleanGraphQLSchema(this.datasource.address, this.datasource.secret).then((result) => {
          this.schema = result.schema
        })
      }
    },
    QUERY: {
      query: GET_QUERY_LIST_BY_DATA_SOURCE_ID,
      fetchPolicy: 'no-cache',
      variables(): { datasourceId: number } {
        return {
          datasourceId: this.datasourceId
        }
      },
      skip(): boolean {
        return !this.datasourceId
      },
      result({data}): void {
        this.queries = data.QUERY
      }
    },
    MUTATION: {
      query: GET_EXT_MUTATION_LIST_BY_DATA_SOURCE_ID,
      fetchPolicy: 'no-cache',
      variables(): { datasourceId: number } {
        return {
          datasourceId: this.datasourceId
        }
      },
      skip(): boolean {
        return !this.datasourceId
      },
      result({data}): void {
        this.mutations = data.MUTATION
      }
    }
  }
})
</script>

<style scoped>

</style>