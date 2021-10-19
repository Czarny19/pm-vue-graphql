<template>
  <v-card color="secondary" class="dashboard__tabs--container">
    <v-card-title class="primary">
      <v-icon class="pr-4">fa-pencil-ruler</v-icon>
      {{ $t('dashboard.themes') }}
    </v-card-title>

    <v-card-text v-if="themes.length === 0">
      <v-icon class="pt-6" x-large>fa-folder-open</v-icon>
      <div class="pt-2">{{ $t('dashboard.noThemes') }}</div>
      <v-btn class="mt-6" color="success" @click="createTheme">{{ $t('dashboard.addFirstTheme') }}</v-btn>
    </v-card-text>

    <v-card-text v-else class="pa-2">
      <v-expansion-panels>
        <v-expansion-panel v-for="theme in themes" :key="theme.id">
          <v-expansion-panel-header class="primary text-left" expand-icon="fa-angle-down">
            <div class="text-on-accent">{{ theme.name }}</div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-card-text class="text-left text-h6 pl-0 pr-0">
              <!--              {{ app.description }}-->
            </v-card-text>
            <v-card-subtitle class="text-left text-body-2 pa-0 pb-1">
              {{ $t('dashboard.createDate') }}: {{ theme.create_date }}
            </v-card-subtitle>
            <v-divider/>
            <v-card-actions class="pl-0 pr-0 pt-4">
              <v-btn class="pl-4 pr-4 mr-2" color="info" @click="openModifyTheme(theme.id)">
                {{ $t('common.modify') }}
              </v-btn>
              <v-btn class="pl-4 pr-4" color="error" @click="deleteTheme(theme.id)">
                {{ $t('common.delete') }}
              </v-btn>
            </v-card-actions>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>

      <div class="text-right mt-auto">
        <v-btn class="ml-auto mt-4 mb-2" color="success" @click="createTheme">{{ $t('dashboard.newApp') }}</v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import {CURRENT_USER} from "@/graphql/queries/user";
import {GET_USER_THEMES_QUERY} from "@/graphql/queries/theme";
import {DELETE_PROJECT} from "@/graphql/queries/project";

export default {
  name: 'DashboardThemesTab',
  data() {
    return {
      currentUser: null,
      themes: []
    }
  },
  methods: {
    createTheme() {
      this.$router.push({name: 'NewTheme'})
    },
    openModifyTheme() {

    },
    deleteTheme(id) {
      this.$apollo.mutate({
        mutation: DELETE_PROJECT,
        variables: {
          id: id
        }
      }).then(() => {
        this.$apollo.queries.PROJECT.refetch()
      })
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
        this.themes = data.THEME
      }
    }
  }
}
</script>

<style scoped>

</style>