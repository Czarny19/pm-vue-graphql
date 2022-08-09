<template>
  <div>
    <DeleteConfirmationDialog :dialog="deleteDialog" @confirm="deleteTheme" @cancel="cancelDeleteTheme"/>

    <InfoDialog
        :dialog="warningDialog"
        :title="i18n('dashboard.themeDeleteWarning')"
        :msg="i18n('dashboard.themeProjectExists')"
        @close="closeWarningDialog">
    </InfoDialog>

    <TitleCard :title="i18n('dashboard.themes')" icon="fa-palette"/>
    <AddItemCard :label="i18n('dashboard.addTheme')" @add="createTheme"/>

    <LoadingCircular v-if="loading"/>
    <DashboardTabNoData v-else-if="!themes.length && !loading" :msg="i18n('dashboard.noThemes')"/>

    <DashboardThemesList v-if="themes.length && !loading" :themes="themes" @delete="deleteThemeClicked"/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import DeleteConfirmationDialog from "@/components/dialog/DeleteConfirmationDialog.vue";
import TitleCard from "@/components/card/TitleCard.vue";
import LoadingCircular from "@/components/loading/LoadingCircular.vue";
import DashboardTabNoData from "@/views/main/dashboard/component/tab/DashboardTabNoData.vue";
import AddItemCard from "@/components/card/AddItemCard.vue";
import DashboardThemesList from "@/views/main/dashboard/component/theme/DashboardThemesList.vue";
import InfoDialog from "@/components/dialog/InfoDialog.vue";
import {DELETE_THEME} from "@/graphql/queries/theme";
import {GET_PROJECT_LIST_BY_THEME_ID} from "@/graphql/queries/project";
import {ThemeColors} from "@/lib/types";

export default Vue.extend({
  name: 'DashboardThemesTab',
  components: {
    DashboardThemesList,
    AddItemCard,
    InfoDialog,
    DashboardTabNoData,
    LoadingCircular,
    TitleCard,
    DeleteConfirmationDialog
  },
  props: {
    loading: Boolean,
    themes: Array
  },
  data() {
    return {
      warningDialog: false,
      deleteDialog: false,
      deleteId: -1
    }
  },
  methods: {
    colors(index: number): ThemeColors {
      return this.themes[index] as ThemeColors;
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

      this.$apollo.mutate({mutation: DELETE_THEME, variables: {id: this.deleteId}}).then(() => {
        this.$apollo.queries.THEME.refetch()
      })
    },
    closeWarningDialog(): void {
      this.warningDialog = false
    }
  },
  apollo: {
    PROJECT: {
      query: GET_PROJECT_LIST_BY_THEME_ID,
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