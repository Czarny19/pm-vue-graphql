<template>
  <v-card color="secondary" class="dashboard__tabs--container">
    <DeleteConfirmationDialog :dialog="deleteDialog" @confirmed="deleteTheme" @cancelled="cancelDeleteTheme"/>

    <DashboardThemeWarningDialog :dialog="warningDialog" @closed="closeWarningDialog"/>

    <v-card-title class="primary">
      <v-icon class="pr-4">fa-pencil-ruler</v-icon>
      {{ $t('dashboard.themes') }}
    </v-card-title>

    <v-card-text v-if="loading">
      <v-progress-circular class="ml-auto mr-auto card-loading" indeterminate color="primary" size="50"/>
    </v-card-text>

    <v-card-text v-else-if="themes.length === 0 && !loading">
      <v-icon class="pt-6" x-large>fa-folder-open</v-icon>
      <div class="pt-6 title-text">{{ $t('dashboard.noThemes') }}</div>
      <v-btn class="mt-6 dashboard__tabs--first-button" color="success" @click="createTheme">
        {{ $t('dashboard.addFirstTheme') }}
      </v-btn>
    </v-card-text>

    <v-card-text v-else class="pa-2">
      <v-expansion-panels>
        <v-expansion-panel v-for="theme in themes" :key="theme.id">
          <v-expansion-panel-header class="primary text-left" expand-icon="fa-angle-down">
            {{ theme.name }}
          </v-expansion-panel-header>

          <v-expansion-panel-content class="pt-4">
            <ColorWithDescription :color="theme.primary_color" :description="$t('theme.primary')"/>
            <ColorWithDescription :color="theme.secondary_color" :description="$t('theme.secondary')"/>
            <ColorWithDescription :color="theme.accent_color" :description="$t('theme.accent')"/>
            <ColorWithDescription :color="theme.info_color" :description="$t('theme.info')"/>
            <ColorWithDescription :color="theme.success_color" :description="$t('theme.success')"/>
            <ColorWithDescription :color="theme.error_color" :description="$t('theme.error')"/>
            <ColorWithDescription :color="theme.text_color_1" :description="$t('theme.primaryText')"/>
            <ColorWithDescription :color="theme.text_color_2" :description="$t('theme.secondaryText')"/>

            <div class="pl-0 pr-0 pt-6 text-left">
              <v-btn class="mr-4" color="info" min-width="100" @click="openModifyTheme(theme.id)">
                {{ $t('common.modify') }}
                <v-icon class="ml-4" x-small>fa-pen</v-icon>
              </v-btn>
              <v-btn color="error" min-width="100" @click="deleteThemeClicked(theme.id)">
                {{ $t('common.delete') }}
                <v-icon class="ml-4" small>fa-times-circle</v-icon>
              </v-btn>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>

      <div class="text-right mt-auto">
        <v-btn class="ml-auto mt-4 mb-2" color="success" @click="createTheme">{{ $t('dashboard.addTheme') }}</v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import {CURRENT_USER} from "@/graphql/queries/user";
import {DELETE_THEME, GET_USER_THEMES_QUERY} from "@/graphql/queries/theme";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import DashboardThemeWarningDialog from "@/views/dashboard/components/warnings/DashboardThemeWarningDialog";
import {GET_PROJECTS_WITH_THEME} from "@/graphql/queries/project";
import ColorWithDescription from "@/components/ColorWithDescription";

export default {
  name: 'DashboardThemesTab',
  components: {ColorWithDescription, DashboardThemeWarningDialog, DeleteConfirmationDialog},
  data() {
    return {
      loading: true,
      warningDialog: false,
      deleteDialog: false,
      deleteId: null,
      projectWithThemeExists: false,
      currentUser: null,
      themes: []
    }
  },
  methods: {
    createTheme() {
      this.$router.push({name: 'NewTheme'})
    },
    openModifyTheme(id) {
      this.$router.push({name: 'Theme', params: {themeId: id}})
    },
    deleteThemeClicked(id) {
      this.deleteId = id
      this.$apollo.queries.PROJECT.refresh()
    },
    cancelDeleteTheme() {
      this.deleteId = null
      this.deleteDialog = false
    },
    deleteTheme() {
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
    closeWarningDialog() {
      this.warningDialog = false
    }
  },
  apollo: {
    currentUser: {
      query: CURRENT_USER
    },
    THEME: {
      query: GET_USER_THEMES_QUERY,
      fetchPolicy: 'network-only',
      variables() {
        return {
          user_id: this.currentUser.id
        }
      },
      skip() {
        return !this.currentUser
      },
      result({data}) {
        this.loading = false
        this.themes = data.THEME
      }
    },
    PROJECT: {
      query: GET_PROJECTS_WITH_THEME,
      fetchPolicy: 'network-only',
      variables() {
        return {
          id: this.deleteId
        }
      },
      skip() {
        return !this.deleteId
      },
      result({data}) {
        if (data.PROJECT.length) {
          this.warningDialog = true
          this.deleteId = null
          return
        }

        this.deleteDialog = true
      }
    }
  }
}
</script>

<style scoped>

</style>