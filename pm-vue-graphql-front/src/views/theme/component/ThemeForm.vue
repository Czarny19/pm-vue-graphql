<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="12" sm="12" md="12" lg="7" xl="7" class="pa-2">
        <v-card color="primary" class="pa-2">
          <LoadingCircular v-if="loading"/>

          <template v-else>
            <CardSectionTitle class="mt-4" :title="i18n('theme.theme')"/>

            <v-card-text class="pt-4">
              <v-form v-model="valid" ref="form" @submit.prevent="submit">
                <v-text-field
                    color="accent"
                    v-model="themeName"
                    :label="i18n('theme.name')"
                    required
                    :counter="30"
                    :rules="nameRules">
                </v-text-field>
              </v-form>
            </v-card-text>

            <CardSectionTitle :title="i18n('theme.colors')"/>

            <ThemeFormColors class="pa-4" :colors="colors" @colorchanged="updateColor"/>

            <v-divider class="ml-4 mr-4"></v-divider>

            <v-card-actions class="ma-2">
              <IconButton :label="i18n('theme.save')" color="success" icon="fa-save" @click="submit"/>
              <v-spacer></v-spacer>
              <IconButton :label="i18n('common.cancel')" color="error" icon="fa-times" @click="cancel"/>
            </v-card-actions>
          </template>
        </v-card>
      </v-col>

      <v-col class="pa-2">
        <v-card color="primary" class="pa-2 fill-height">
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
import ThemeFormColors from "@/views/theme/component/ThemeFormColors.vue";
import LoadingCircular from "@/components/loading/LoadingCircular.vue";
import CardSectionTitle from "@/components/card/CardSectionTitle.vue";
import IconButton from "@/components/button/IconButton.vue";
import {ADD_THEME_FOR_USER, GET_THEME_BY_ID, UPDATE_THEME_BY_ID} from "@/graphql/queries/theme";
import {CURRENT_USER} from "@/graphql/queries/user";
import {Colors} from "@/plugins/types";

export default Vue.extend({
  name: 'ThemeForm',
  components: {IconButton, CardSectionTitle, LoadingCircular, ThemeFormColors, ThemePreview},
  props: {
    themeId: Number,
  },
  data() {
    return {
      loading: true,
      themeName: '',
      valid: false,
      currentUser: {id: -1},
      nameRules: [
        (v: string) => !!v || this.$t('theme.nameRequired'),
        (v: string) => (v && v.length <= 30) || this.$t('theme.nameTooLong'),
      ],
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
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    },
    submit(): void {
      (this.$refs.form as Vue & { validate: () => boolean }).validate()

      if (this.valid) {
        this.$emit('saving', true)
        this.themeId ? this.updateTheme() : this.createTheme()
      }
    },
    cancel(): void {
      this.$router.back()
    },
    updateColor(colorData: { color: string; id: string }): void {
      this.colors[colorData.id as keyof Colors] = colorData.color
    },
    updateTheme(): void {
      this.$apollo.mutate({
        mutation: UPDATE_THEME_BY_ID,
        variables: {
          id: this.themeId,
          name: this.themeName,
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
        this.$emit('saving', false)
        this.$router.back()
      }).catch(() => {
        this.$emit('saving', false)
      })
    },
    createTheme(): void {
      this.$apollo.mutate({
        mutation: ADD_THEME_FOR_USER,
        variables: {
          userId: this.currentUser.id,
          name: this.themeName,
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
    THEME: {
      query: GET_THEME_BY_ID,
      fetchPolicy: 'network-only',
      variables(): { id: number } {
        return {
          id: this.themeId
        }
      },
      skip(): boolean {
        return !this.themeId
      },
      result({data}): void {
        this.loading = false
        this.themeName = data.THEME[0].name
        this.colors['primary_color'] = data.THEME[0].primary_color
        this.colors['secondary_color'] = data.THEME[0].secondary_color
        this.colors['accent_color'] = data.THEME[0].accent_color
        this.colors['info_color'] = data.THEME[0].info_color
        this.colors['success_color'] = data.THEME[0].success_color
        this.colors['error_color'] = data.THEME[0].error_color
        this.colors['text_color_1'] = data.THEME[0].text_color_1
        this.colors['text_color_2'] = data.THEME[0].text_color_2
        this.colors['background_color'] = data.THEME[0].background_color
      }
    }
  },
  beforeMount() {
    if (!this.themeId) {
      this.loading = false
    }
  }
})
</script>

<style scoped>

</style>