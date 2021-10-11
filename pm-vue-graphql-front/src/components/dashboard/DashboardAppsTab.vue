<template>
  <v-card color="secondary" class="dashboard__tabs--container">
    <v-card-title class="primary">
      <v-icon class="pr-4">fa-tablet</v-icon>
      {{ $t('dashboard.apps') }}
    </v-card-title>
    <v-card-text>
      <div>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-expansion-panels>
                <v-expansion-panel v-for="app in apps" :key="app.id">
                  <v-expansion-panel-header class="accent text-left" expand-icon="fa-angle-down">
                    <v-icon color="white" class="pr-5">fa-tablet</v-icon>
                    <div class="text-on-accent">{{ app.name }}</div>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-card-text class="text-left text-body-1 pl-0 pr-0">
                      {{ app.description }}
                    </v-card-text>
                    <v-card-subtitle class="text-left text-body-2 pa-0 pb-1">
                      {{ $t('dashboard.createDate') }}: {{ app.create_date }}
                    </v-card-subtitle>
                    <v-divider/>
                    <v-card-actions class="pl-0 pr-0 pt-4">
                      <v-btn class="ml-auto mr-4" color="primary">Otwórz</v-btn>
                      <v-menu offset-y>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn color="warning" dark v-bind="attrs" v-on="on">
                            Dodatkowe opcje
                          </v-btn>
                        </template>
                        <v-list>
                          <v-list-item v-for="(item, index) in items" :key="index">
                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </v-card-actions>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import {GET_USER_PROJECTS_QUERY} from "@/graphql/queries/project";
import {CURRENT_USER} from "@/graphql/queries/user";

export default {
  name: 'DashboardAppsTab',
  data() {
    return {
      currentUser: null,
      apps: []
    }
  },
  apollo: {
    currentUser: {
      query: CURRENT_USER
    },
    PROJECT: {
      query: GET_USER_PROJECTS_QUERY,
      fetchPolicy: 'network-only',
      variables() {
        return {
          user_id: this.currentUser[0].id
        }
      },
      skip() {
        return !this.currentUser
      },
      result({data}) {
        this.apps = data.PROJECT
      },
    }
  }
}
</script>

<style scoped>

</style>