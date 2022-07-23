<template>
  <div>
    <DeleteConfirmationDialog :dialog="deleteDialog" @confirm="deleteTheme" @cancel="cancelDeleteTheme"/>

    <InfoDialog
        :dialog="warningDialog"
        :title="i18n('dashboard.themeDeleteWarning')"
        :msg="i18n('dashboard.themeProjectExists')"
        @close="closeWarningDialog">
    </InfoDialog>

    <v-card class="mb-4" color="primary">
      <TitleCard :title="i18n('dashboard.themes')" icon="fa-palette"/>
    </v-card>

    <v-card color="primary">
      <LoadingCircular v-if="loading"/>
      <DashboardTabNoData v-else-if="!themes.length && !loading" :msg="i18n('dashboard.noThemes')"/>
    </v-card>

    <v-expansion-panels v-if="themes.length && !loading">
      <v-expansion-panel v-for="(theme, index) in themes" :key="theme.id">
        <v-expansion-panel-header class="text-start text-body-1" expand-icon="fa-angle-down" color="secondary">
          {{ theme.name }}
        </v-expansion-panel-header>

        <v-expansion-panel-content>
          <ColorReadOnlyList class="pt-6" :theme="colors(index)"/>

          <v-tooltip top color="primary" class="pa-4" min-width="600">
            <template v-slot:activator="{ on, attrs }">
              <div class="text-start">
                <v-btn class="mb-4 mt-0 ml-4 pa-4" color="primary" min-width="200" v-bind="attrs" v-on="on">
                  {{ i18n('dashboard.themePreview') }}
                  <v-icon small class="pl-6">fa-message</v-icon>
                </v-btn>
              </div>
            </template>
            <ThemePreview :colors="colors(index)"/>
          </v-tooltip>

          <v-divider class="ml-4 mr-4"></v-divider>

          <v-container fluid class="pa-4">
            <v-row no-gutters>
              <v-col cols="6" class="text-start">
                <IconButton
                    :label="i18n('common.modify')"
                    color="info"
                    icon="fa-edit"
                    @click="openModifyTheme(theme.id)">
                </IconButton>
              </v-col>

              <v-col class="text-end">
                <IconButton
                    :label="i18n('common.delete')"
                    color="error"
                    icon="fa-trash-can"
                    @click="deleteThemeClicked(theme.id)">
                </IconButton>
              </v-col>
            </v-row>
          </v-container>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-card class="pa-4 mt-4 text-end" color="primary">
      <v-btn class="pa-5" min-width="300" color="success" @click="createTheme">
        {{ i18n('dashboard.addTheme') }}
        <v-icon small class="pl-6">fa-plus</v-icon>
      </v-btn>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import DeleteConfirmationDialog from "@/components/dialog/DeleteConfirmationDialog.vue";
import TitleCard from "@/components/card/TitleCard.vue";
import LoadingCircular from "@/components/loading/LoadingCircular.vue";
import DashboardTabNoData from "@/views/main/dashboard/component/tab/DashboardTabNoData.vue";
import ColorReadOnlyList from "@/components/theme/ColorReadOnlyList.vue";
import IconButton from "@/components/button/IconButton.vue";
import ThemePreview from "@/components/theme/ThemePreview.vue";
import InfoDialog from "@/components/dialog/InfoDialog.vue";
import {CURRENT_USER} from "@/graphql/queries/user";
import {DELETE_THEME, GET_USER_THEMES} from "@/graphql/queries/theme";
import {GET_PROJECTS_WITH_THEME} from "@/graphql/queries/project";
import {Colors} from "@/plugins/types";

export default Vue.extend({
  name: 'DashboardThemesTab',
  components: {
    InfoDialog,
    ThemePreview,
    IconButton,
    ColorReadOnlyList,
    DashboardTabNoData,
    LoadingCircular,
    TitleCard,
    DeleteConfirmationDialog
  },
  data() {
    return {
      loading: true,
      warningDialog: false,
      deleteDialog: false,
      deleteId: -1,
      projectWithThemeExists: false,
      currentUser: {id: -1},
      themes: [],
      panels: []
    }
  },
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    },
    colors(index: number): Colors {
      return this.themes[index] as Colors;
    },
    createTheme(): void {
      this.$router.push({name: 'NewTheme'})
    },
    openModifyTheme(id: string): void {
      this.$router.push({name: 'Theme', params: {themeId: id}})
    },
    deleteThemeClicked(id: number): void {
      this.deleteId = id
      this.$apollo.queries.PROJECT.refresh()
    },
    cancelDeleteTheme(): void {
      this.deleteId = -1
      this.deleteDialog = false
    },
    deleteTheme(): void {
      this.deleteDialog = false

      this.$apollo.mutate({
        mutation: DELETE_THEME,
        variables: {
          id: this.deleteId
        }
      }).then(() => {
        this.$apollo.queries.THEME.refetch()
      })
    },
    closeWarningDialog(): void {
      this.warningDialog = false
    }
  },
  apollo: {
    currentUser: {
      query: CURRENT_USER
    },
    THEME: {
      query: GET_USER_THEMES,
      fetchPolicy: 'network-only',
      variables(): { userId: number } {
        return {
          userId: this.currentUser.id
        }
      },
      skip(): boolean {
        return !this.currentUser
      },
      result({data}): void {
        this.loading = false
        this.themes = data.THEME
      }
    },
    PROJECT: {
      query: GET_PROJECTS_WITH_THEME,
      fetchPolicy: 'network-only',
      variables(): { id: number } {
        return {
          id: this.deleteId
        }
      },
      skip(): boolean {
        return this.deleteId < 0
      },
      result({data}): void {
        if (data.PROJECT.length) {
          this.warningDialog = true
          this.deleteId = -1
          return
        }

        this.deleteDialog = true
      }
    }
  }
})
</script>

<style scoped>

</style>