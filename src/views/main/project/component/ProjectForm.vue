<template>
  <v-container fluid class="pa-0 pb-3">
    <LoadingDialog :dialog="saving" :title="i18n('project.saving')"/>

    <v-row no-gutters>
      <v-col cols="12">
        <v-card color="primary" class="pt-2 pb-1 ma-1">
          <LoadingCircular v-if="loading"/>

          <template v-else>
            <v-form v-model="valid" ref="form" @submit.prevent="submit">
              <CardSectionTitle class="mt-1" :title="i18n('project.projectDefinition')"/>
              <ProjectFormBasicInfo class="pt-4" :project="projectData" :themes="themes" @cleartheme="clearTheme"/>

              <CardSectionTitle :title="i18n('project.theme')"/>
              <ColorReadOnlyList class="pa-3 pt-8" v-if="project.theme_id" :theme="currentTheme"/>

              <CardSectionTitle :title="i18n('project.datasource')"/>
              <ProjectFormDatasource v-if="project" :project="projectData" :datasources="datasources" @clearsource="clearDatasource"/>
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
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import LoadingCircular from "@/components/loading/LoadingCircular.vue";
import CardSectionTitle from "@/components/card/CardSectionTitle.vue";
import IconButton from "@/components/button/IconButton.vue";
import ColorReadOnlyList from "@/components/theme/ColorReadOnlyList.vue";
import ProjectFormBasicInfo from "@/views/main/project/component/ProjectFormBasicInfo.vue";
import ProjectFormDatasource from "@/views/main/project/component/ProjectFormDatasource.vue";
import LoadingDialog from "@/components/dialog/LoadingDialog.vue";
import {ADD_PROJECT, UPDATE_PROJECT} from "@/graphql/queries/project";
import {AppProject, Theme} from "@/lib/types";

export default Vue.extend({
  name: 'ProjectForm',
  components: {
    ProjectFormDatasource,
    LoadingDialog,
    ProjectFormBasicInfo,
    ColorReadOnlyList,
    IconButton,
    CardSectionTitle,
    LoadingCircular
  },
  props: {
    loading: Boolean,
    project: Object,
    datasources: Array,
    themes: Array,
    userId: Number
  },
  data() {
    return {
      valid: false,
      saving: false,
      projectData: {}
    }
  },
  computed: {
    projectTyped(): AppProject {
      return (this.projectData as AppProject)
    },
    currentTheme(): Theme {
      return (this.themes as Theme[]).filter((theme: Theme) => theme.id === this.project.theme_id)[0]
    }
  },
  methods: {
    submit(): void {
      (this.$refs.form as Vue & { validate: () => boolean }).validate()

      if (this.valid) {
        this.saving = true
        this.project.id ? this.updateProject() : this.createProject()
      }
    },
    cancel(): void {
      this.$router.back()
    },
    clearTheme(): void {
      this.projectTyped.theme_id = undefined
    },
    clearDatasource(): void {
      this.projectTyped.source_id = undefined
    },
    updateProject(): void {
      this.$apollo.mutate({
        mutation: UPDATE_PROJECT,
        variables: {
          id: this.projectTyped.id,
          name: this.projectTyped.name,
          description: this.projectTyped.description,
          themeId: this.projectTyped.theme_id,
          datasourceId: this.projectTyped.source_id
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
        mutation: ADD_PROJECT,
        variables: {
          userId: this.userId,
          name: this.projectTyped.name,
          description: this.projectTyped.description,
          themeId: this.projectTyped.theme_id,
          datasourceId: this.projectTyped.source_id
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
    project: {
      handler() {
        this.projectData = this.project
      },
      deep: true
    }
  }
})
</script>

<style scoped>

</style>