<template>
  <v-container fluid class="pa-0 pb-3">
    <LoadingDialog :dialog="saving" :title="i18n('theme.saving')"/>

    <v-row no-gutters>
      <v-col cols="12" sm="12" md="12" lg="7" xl="7" class="pb-3">
        <v-card color="primary" class="pt-2 ma-1 fill-height">
          <LoadingCircular v-if="loading"/>

          <template v-else>
            <CardSectionTitle :title="i18n('theme.theme')"/>

            <v-form class="pl-2 pr-2 pt-2" v-model="valid" ref="form" @submit.prevent="submit">
              <v-card-text>
                <v-text-field
                    color="accent"
                    prepend-icon="fa-tag"
                    v-model="themeData.name"
                    :label="i18n('theme.name')"
                    :counter="30"
                    :rules="nameRules"
                    required>
                </v-text-field>
              </v-card-text>
            </v-form>

            <CardSectionTitle :title="i18n('theme.colors')"/>

            <ThemeFormColors class="pa-1" :colors="colors" @colorchanged="updateColor"/>

            <v-divider class="ml-4 mr-4"></v-divider>

            <v-card-actions class="ma-2">
              <IconButton :label="i18n('theme.save')" color="success" icon="fa-save" @click="submit"/>
              <v-spacer></v-spacer>
              <IconButton :label="i18n('common.cancel')" color="error" icon="fa-times" @click="cancel"/>
            </v-card-actions>
          </template>
        </v-card>
      </v-col>

      <v-col class="pb-3">
        <v-card color="primary" class="ma-1 fill-height">
          <v-card-text class="fill-height">
            <ThemePreview :colors="colors"/>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import ThemePreview from "@/components/theme/ThemePreview.vue";
import ThemeFormColors from "@/views/main/theme/component/ThemeFormColors.vue";
import LoadingCircular from "@/components/loading/LoadingCircular.vue";
import CardSectionTitle from "@/components/card/CardSectionTitle.vue";
import IconButton from "@/components/button/IconButton.vue";
import {ADD_THEME, UPDATE_THEME} from "@/graphql/queries/theme";
import {Theme, ThemeColors} from "@/lib/types";
import LoadingDialog from "@/components/dialog/LoadingDialog.vue";

export default Vue.extend({
  name: 'ThemeForm',
  components: {LoadingDialog, IconButton, CardSectionTitle, LoadingCircular, ThemeFormColors, ThemePreview},
  props: {
    loading: Boolean,
    theme: Object,
    userId: Number
  },
  data() {
    return {
      valid: false,
      saving: false,
      themeData: {},
      colors: {
        'primary_color': '#878787FF',
        'secondary_color': '#3A3A3AFF',
        'accent_color': '#797E8DFF',
        'info_color': '#1C5BAFFF',
        'success_color': '#116E13FF',
        'error_color': '#CB1111FF',
        'text_color_1': '#090909FF',
        'text_color_2': '#2D2D2DFF',
        'background_color': '#FFFFFFFF'
      },
    }
  },
  computed: {
    nameRules() {
      return [
        (v: string) => !!v || this.$t('theme.nameRequired'),
        (v: string) => (v && v.length <= 30) || this.$t('theme.nameTooLong'),
      ]
    },
    themeTyped(): Theme {
      return (this.themeData as Theme)
    }
  },
  methods: {
    submit(): void {
      (this.$refs.form as Vue & { validate: () => boolean }).validate()

      if (this.valid) {
        this.saving = true
        this.themeTyped.id ? this.updateTheme() : this.createTheme()
      }
    },
    cancel(): void {
      this.$router.back()
    },
    updateColor(colorData: { color: string; id: string }): void {
      this.colors[colorData.id as keyof ThemeColors] = colorData.color
    },
    updateTheme(): void {
      this.$apollo.mutate({
        mutation: UPDATE_THEME,
        variables: {
          id: this.themeTyped.id,
          name: this.themeTyped.name,
          primary: this.colors['primary_color'],
          secondary: this.colors['secondary_color'],
          accent: this.colors['accent_color'],
          info: this.colors['info_color'],
          success: this.colors['success_color'],
          error: this.colors['error_color'],
          text1: this.colors['text_color_1'],
          text2: this.colors['text_color_2'],
          background: this.colors['background_color']
        }
      }).then(() => {
        this.saving = false
        this.$router.back()
      }).catch((err) => {
        console.log(err)
        this.saving = false
      })
    },
    createTheme(): void {
      this.$apollo.mutate({
        mutation: ADD_THEME,
        variables: {
          userId: this.userId,
          name: this.themeTyped.name,
          primary: this.colors['primary_color'],
          secondary: this.colors['secondary_color'],
          accent: this.colors['accent_color'],
          info: this.colors['info_color'],
          success: this.colors['success_color'],
          error: this.colors['error_color'],
          text1: this.colors['text_color_1'],
          text2: this.colors['text_color_2'],
          background: this.colors['background_color']
        }
      }).then(() => {
        this.saving = false
        this.$router.back()
      }).catch(() => {
        this.saving = false
      })
    }
  },
  watch: {
    theme: {
      handler() {
        this.themeData = this.theme
        this.colors['primary_color'] = this.theme.primary_color
        this.colors['secondary_color'] = this.theme.secondary_color
        this.colors['accent_color'] = this.theme.accent_color
        this.colors['info_color'] = this.theme.info_color
        this.colors['success_color'] = this.theme.success_color
        this.colors['error_color'] = this.theme.error_color
        this.colors['text_color_1'] = this.theme.text_color_1
        this.colors['text_color_2'] = this.theme.text_color_2
        this.colors['background_color'] = this.theme.background_color
      },
      deep: true
    }
  }
})
</script>

<style scoped>

</style>