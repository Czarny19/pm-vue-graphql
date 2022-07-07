<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="12" sm="12" md="7" lg="8" xl="9" class="pa-2">
        <v-card color="primary" class="pa-2">
          <LoadingCircular v-if="loading"/>

          <template v-else>
            <CardSectionTitle class="mt-4" :title="i18n('project.projectDefinition')"/>

            <v-form v-model="valid" ref="form" @submit.prevent="submit">
              <v-card-text class="pt-4">
                <v-text-field
                    class="pa-4"
                    color="accent"
                    v-model="projectName"
                    :label="i18n('project.name')"
                    :counter="30"
                    :rules="nameRules"
                    prepend-icon="fa-tag"
                    required>
                </v-text-field>

                <v-textarea
                    class="pa-4"
                    color="accent"
                    v-model="description"
                    :label="i18n('project.description')"
                    :rules="descriptionRules"
                    :counter="200"
                    prepend-icon="fa-pen"
                    required
                    auto-grow
                    rows="1">
                </v-textarea>
              </v-card-text>

              <CardSectionTitle :title="i18n('project.theme')"/>

              <v-card-text class="pt-4">
                <v-select
                    class="pa-4"
                    color="accent"
                    item-color="accent"
                    v-model="themeId"
                    :items="themes"
                    :label="i18n('project.theme')"
                    :rules="themeRules"
                    required
                    append-icon="fa-chevron-down"
                    prepend-icon="fa-palette"
                    item-text="name"
                    item-value="id">

                  <template v-slot:append-outer>
                    <v-icon class="pl-2 pr-2" @click="clearTheme">fa-times</v-icon>
                  </template>
                </v-select>

                <ColorReadOnlyList v-if="themeSet" :theme="theme"/>
              </v-card-text>

              <CardSectionTitle :title="i18n('project.dataSource')"/>

              <v-card-text class="pt-4 pb-0">
                <v-select
                    class="pa-4"
                    color="accent"
                    v-model="dataSourceId"
                    :items="dataSources"
                    :label="i18n('project.dataSource')"
                    required
                    append-icon="fa-chevron-down"
                    append-outer-icon="fa-times"
                    prepend-icon="fa-database"
                    item-text="name"
                    item-value="id">

                  <template v-slot:append-outer>
                    <v-icon class="pl-2 pr-2" @click="clearDatasource">fa-times</v-icon>
                  </template>
                </v-select>
              </v-card-text>

              <template v-if="dataSourceSet">
                <div class="text-start pl-8 pr-8">
                  {{ i18n('datasource.address') }}: <i>{{ dataSourceAddress }}</i>
                </div>
                <GraphQLConnectionTest
                    class="pl-8 pt-6 pb-4"
                    :address="dataSourceAddress"
                    :secret="dataSourceSecret"
                    :is-auto="true">
                </GraphQLConnectionTest>
              </template>
            </v-form>

            <v-divider class="ml-4 mr-4"></v-divider>

            <v-card-actions class="ma-2">
              <IconButton :label="i18n('project.save')" color="success" icon="fa-save" @click="submit"/>
              <v-spacer></v-spacer>
              <IconButton :label="i18n('common.cancel')" color="error" icon="fa-times" @click="cancel"/>
            </v-card-actions>
          </template>
        </v-card>
      </v-col>

      <v-col class="pa-2">
        <ProjectInfo/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import LoadingCircular from "@/components/loading/LoadingCircular.vue";
import ProjectInfo from "@/views/project/components/ProjectInfo.vue";
import CardSectionTitle from "@/components/card/CardSectionTitle.vue";
import IconButton from "@/components/button/IconButton.vue";
import ColorReadOnlyList from "@/components/theme/ColorReadOnlyList.vue";
import GraphQLConnectionTest from "@/components/graphql/GraphQLConnectionTest.vue";
import {ADD_PROJECT_FOR_USER, GET_PROJECT_BY_ID, UPDATE_PROJECT_BY_ID} from "@/graphql/queries/project";
import {CURRENT_USER} from "@/graphql/queries/user";
import {GET_USER_THEMES_QUERY} from "@/graphql/queries/theme";
import {GET_USER_DATA_SOURCES} from "@/graphql/queries/data_source";
import {DataSource, Theme} from "@/plugins/types";
import {cryptoKey} from "@/main";
import * as CryptoJS from "crypto-js";

export default Vue.extend({
  name: 'ProjectForm',
  components: {GraphQLConnectionTest, ColorReadOnlyList, IconButton, CardSectionTitle, ProjectInfo, LoadingCircular},
  props: {
    projectId: Number,
  },
  data() {
    return {
      loading: true,
      currentUser: {id: -1},
      projectName: '',
      description: '',
      themes: [],
      theme: {},
      themeSet: false,
      themeId: null,
      dataSources: [],
      dataSourceId: null,
      dataSourceSet: false,
      dataSourceAddress: '',
      dataSourceSecret: '',
      valid: false,
      nameRules: [
        (v: string) => !!v || this.$t('project.nameRequired'),
        (v: string) => (v && v.length <= 30) || this.$t('project.nameTooLong'),
      ],
      descriptionRules: [
        (v: string) => !!v || this.$t('project.descriptionRequired'),
        (v: string) => (v && v.length <= 200) || this.$t('project.descriptionTooLong'),
      ],
      themeRules: [
        (v: string) => !!v || this.$t('project.themeRequired'),
      ]
    }
  },
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    },
    submit(): void {
      (this.$refs.form as Vue & { validate: () => boolean }).validate()

      if (this.valid) {
        this.$emit('saving', true)
        this.projectId ? this.updateProject() : this.createProject()
      }
    },
    cancel(): void {
      this.$router.back()
    },
    setTheme(): void {
      this.theme = this.themes.filter((theme: Theme) => theme.id === Number(this.themeId))[0]
      this.themeSet = true
    },
    clearTheme(): void {
      this.theme = {}
      this.themeSet = false
      this.themeId = null
    },
    setDataSource(): void {
      const dataSource: DataSource = this.dataSources.filter((ds: DataSource) => ds.id === Number(this.dataSourceId))[0]
      this.dataSourceAddress = dataSource.address
      this.dataSourceSecret = CryptoJS.AES.decrypt(dataSource.secret ?? '', cryptoKey).toString(CryptoJS.enc.Utf8)
      this.dataSourceSet = true
    },
    clearDatasource(): void {
      this.dataSourceId = null
      this.dataSourceSet = false
      this.dataSourceAddress = ''
      this.dataSourceSecret = ''
    },
    updateProject(): void {
      this.$apollo.mutate({
        mutation: UPDATE_PROJECT_BY_ID,
        variables: {
          id: this.projectId,
          name: this.projectName,
          description: this.description,
          themeId: this.themeId,
          dataSourceId: this.dataSourceId
        }
      }).then(() => {
        this.$emit('saving', false)
        this.$router.back()
      }).catch(() => {
        this.$emit('saving', false)
      })
    },
    createProject(): void {
      this.$apollo.mutate({
        mutation: ADD_PROJECT_FOR_USER,
        variables: {
          userId: this.currentUser.id,
          name: this.projectName,
          description: this.description,
          themeId: this.themeId,
          dataSourceId: this.dataSourceId
        }
      }).then(() => {
        this.$emit('saving', false)
        this.$router.back()
      }).catch(() => {
        this.$emit('saving', false)
      })
    }
  },
  watch: {
    themeId() {
      if (this.themeId && this.themes.length > 0) {
        this.setTheme()
      }
    },
    dataSourceId() {
      if (this.dataSourceId && this.dataSources.length > 0) {
        this.setDataSource()
      }
    }
  },
  apollo: {
    currentUser: {
      query: CURRENT_USER
    },
    PROJECT: {
      query: GET_PROJECT_BY_ID,
      fetchPolicy: 'network-only',
      variables(): { id: number } {
        return {
          id: this.projectId
        }
      },
      skip(): boolean {
        return !this.projectId
      },
      result({data}): void {
        this.projectName = data.PROJECT[0].name
        this.description = data.PROJECT[0].description
        this.themeId = data.PROJECT[0].theme_id
        this.dataSourceId = data.PROJECT[0].source_id
        this.loading = false
      }
    },
    THEME: {
      query: GET_USER_THEMES_QUERY,
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
        this.themes = data.THEME;

        if (this.themeId && this.themes.length > 0) {
          this.setTheme()
        }
      }
    },
    DATA_SOURCE: {
      query: GET_USER_DATA_SOURCES,
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
        this.dataSources = data.DATA_SOURCE

        if (this.dataSourceId && this.dataSources.length > 0) {
          this.setDataSource()
        }
      }
    }
  },
  beforeMount() {
    if (!this.projectId) {
      this.loading = false
    }
  }
})
</script>

<style scoped>

</style>