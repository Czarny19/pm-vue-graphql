<template>
  <v-card class="ma-4" color="accent">
    <v-card-title>
      {{ $t('project.newProject') }}
    </v-card-title>
    <div class="pb-2 pr-2 pl-2">
      <v-card v-if="loading">
        <div class="text-center">
          <v-progress-circular class="ml-auto mr-auto page-loading" indeterminate color="primary" size="50"/>
        </div>
      </v-card>

      <v-card v-else>
        <v-card-text>
          <v-form v-model="valid" ref="form" @submit.prevent="submit">
            <v-text-field
                class="pb-4"
                v-model="name"
                :label="$t('project.name')"
                :counter="30"
                :rules="nameRules"
                prepend-icon="fa-tag"
                required>
            </v-text-field>

            <v-textarea
                class="pb-4"
                v-model="description"
                :label="$t('project.description')"
                :rules="descriptionRules"
                :counter="200"
                prepend-icon="fa-pen"
                required
                auto-grow
                rows="1">
            </v-textarea>

            <v-select
                class="pb-4"
                v-model="themeId"
                :items="themes"
                :label="$t('project.theme')"
                :rules="themeRules"
                required
                append-icon="fa-chevron-down"
                prepend-icon="fa-pencil-ruler"
                item-text="name"
                item-value="id">
            </v-select>

            <v-select
                class="pb-4"
                v-model="dataSource"
                :items="dataSources"
                :label="$t('project.dataSource')"
                required
                append-icon="fa-chevron-down"
                prepend-icon="fa-database"
                item-text="name"
                item-value="id">
            </v-select>

            <v-container fluid class="pa-0 pt-10">
              <v-row no-gutters>
                <v-col cols="12">
                  <v-btn block large color="primary" @click="submit">
                    {{ $t('project.create') }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
      </v-card>
    </div>
  </v-card>
</template>

<script>
import {ADD_PROJECT_FOR_USER, GET_PROJECT_BY_ID, UPDATE_PROJECT_FOR_ID} from "@/graphql/queries/project";
import {CURRENT_USER} from "@/graphql/queries/user";
import {GET_USER_THEMES_QUERY} from "@/graphql/queries/theme";

export default {
  name: 'ProjectForm',
  props: {
    projectId: Number,
  },
  data() {
    return {
      loading: true,
      name: '',
      description: '',
      themeId: null,
      dataSource: null,
      valid: false,
      themes: [],
      dataSources: [],
      nameRules: [
        v => !!v || this.$t('project.nameRequired'),
        v => (v && v.length <= 30) || this.$t('project.nameTooLong'),
      ],
      descriptionRules: [
        v => !!v || this.$t('project.descriptionRequired'),
        v => (v && v.length <= 200) || this.$t('project.descriptionTooLong'),
      ],
      themeRules: [
        v => !!v || this.$t('project.themeRequired'),
      ]
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate()

      if (this.valid) {
        this.$emit('saving', true)
        this.projectId ? this.updateProject() : this.createProject()
      }
    },
    updateProject() {
      this.$apollo.mutate({
        mutation: UPDATE_PROJECT_FOR_ID,
        variables: {
          id: this.projectId,
          name: this.name,
          description: this.description,
          theme_id: this.themeId,
        }
      }).then(() => {
        this.$emit('saving', false)
        this.$router.back()
      }).catch(() => {
        this.$emit('saving', false)
      })
    },
    createProject() {
      this.$apollo.mutate({
        mutation: ADD_PROJECT_FOR_USER,
        variables: {
          user_id: this.currentUser.id,
          name: this.name,
          description: this.description,
          theme_id: this.themeId
        }
      }).then(() => {
        this.$emit('saving', false)
        this.$router.back()
      }).catch(() => {
        this.$emit('saving', false)
      })
    }
  },
  apollo: {
    currentUser: {
      query: CURRENT_USER
    },
    PROJECT: {
      query: GET_PROJECT_BY_ID,
      fetchPolicy: 'network-only',
      variables() {
        return {
          id: this.projectId
        }
      },
      skip() {
        this.loading = false
        return !this.projectId
      },
      result({data}) {
        this.name = data.PROJECT[0].name
        this.description = data.PROJECT[0].description
        this.themeId = data.PROJECT[0].theme_id
        this.loading = false
      }
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