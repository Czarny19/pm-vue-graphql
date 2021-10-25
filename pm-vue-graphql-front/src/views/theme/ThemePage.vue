<template>
  <v-container>
    <LoadingDialog :dialog="saving" :title="$t('theme.saving')"/>

    <div v-if="loading" class="text-center">
      <v-progress-circular class="ml-auto mr-auto page_loading" indeterminate color="primary" size="50"/>
    </div>

    <v-row v-else>
      <v-col cols="12">
        <v-card class="ma-4" color="accent">
          <v-card-title>{{ $t('theme.interfaceTheme') }}</v-card-title>

          <div class="pb-2 pr-2 pl-2">
            <v-card>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="12" md="12" lg="6" xl="6">
                    <v-form v-model="valid" ref="form" @submit.prevent="submit">
                      <v-text-field v-model="name" :label="$t('theme.name')" required :counter="30" :rules="nameRules"/>

                      <div class="text-left pl-4 mt-6 mb-4 theme__colors--title">
                        {{ $t('theme.colors') }}
                      </div>

                      <v-container class="pa-0">
                        <v-row>
                          <ThemeColorField
                              :color="colors['primary_color']"
                              :label=" $t('theme.primary')"
                              @updateColor="updatePrimary">
                          </ThemeColorField>
                          <ThemeColorField
                              :color="colors['secondary_color']"
                              :label=" $t('theme.secondary')"
                              @updateColor="updateSecondary">
                          </ThemeColorField>
                          <ThemeColorField
                              :color="colors['accent_color']"
                              :label=" $t('theme.accent')"
                              @updateColor="updateAccent">
                          </ThemeColorField>
                          <ThemeColorField
                              :color="colors['info_color']"
                              :label=" $t('theme.info')"
                              @updateColor="updateInfo">
                          </ThemeColorField>
                          <ThemeColorField
                              :color="colors['success_color']"
                              :label=" $t('theme.success')"
                              @updateColor="updateSuccess">
                          </ThemeColorField>
                          <ThemeColorField
                              :color="colors['error_color']"
                              :label=" $t('theme.error')"
                              @updateColor="updateError">
                          </ThemeColorField>
                        </v-row>
                      </v-container>

                      <div class="text-left pl-4 mt-6 mb-4 theme__colors--title">
                        {{ $t('theme.text') }}
                      </div>

                      <v-container class="pa-0">
                        <v-row>
                          <ThemeColorField
                              :color="colors['text_color_1']"
                              :label=" $t('theme.primaryText')"
                              large
                              @updateColor="updateText1">
                          </ThemeColorField>
                          <ThemeColorField
                              :color="colors['text_color_2']"
                              :label=" $t('theme.secondaryText')"
                              large
                              @updateColor="updateText2">
                          </ThemeColorField>
                        </v-row>
                      </v-container>

                      <v-container fluid class="pa-0 pt-10">
                        <v-row no-gutters>
                          <v-col cols="12">
                            <v-btn block large color="primary" @click="submit">
                              {{ $t('theme.save') }}
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-form>
                  </v-col>

                  <v-col cols="12" sm="12" md="12" lg="6" xl="6">
                    <ThemePreview :colors="colors"/>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ThemePreview from "@/views/theme/components/ThemePreview";
import ThemeColorField from "@/views/theme/components/ThemeColorField";
import LoadingDialog from "@/components/LoadingDialog";
import {ADD_THEME_FOR_USER, GET_THEME_BY_ID, UPDATE_THEME_FOR_ID} from "@/graphql/queries/theme";
import {CURRENT_USER} from "@/graphql/queries/user";

export default {
  name: 'ThemePage',
  components: {LoadingDialog, ThemeColorField, ThemePreview},
  data() {
    return {
      loading: true,
      saving: false,
      name: '',
      valid: false,
      nameRules: [
        v => !!v || this.$t('theme.nameRequired'),
        v => (v && v.length <= 30) || this.$t('theme.nameTooLong'),
      ],
      colors: {
        'primary_color': '#878787FF',
        'secondary_color': '#3A3A3AFF',
        'accent_color': '#797E8DFF',
        'info_color': '#1C5BAFFF',
        'success_color': '#116E13FF',
        'error_color': '#CB1111FF',
        'text_color_1': '#090909FF',
        'text_color_2': '#2D2D2DFF'
      },
    }
  },
  computed: {
    themeId() {
      return this.$route.params.themeId
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate()

      if (this.valid) {
        this.saving = true
        this.themeId ? this.updateTheme() : this.createTheme()
      }
    },
    updatePrimary(color) {
      this.colors['primary_color'] = color
    },
    updateSecondary(color) {
      this.colors['secondary_color'] = color
    },
    updateAccent(color) {
      this.colors['accent_color'] = color
    },
    updateInfo(color) {
      this.colors['info_color'] = color
    },
    updateSuccess(color) {
      this.colors['success_color'] = color
    },
    updateError(color) {
      this.colors['error_color'] = color
    },
    updateText1(color) {
      this.colors['text_color_1'] = color
    },
    updateText2(color) {
      this.colors['text_color_2'] = color
    },
    updateTheme() {
      this.$apollo.mutate({
        mutation: UPDATE_THEME_FOR_ID,
        variables: {
          id: this.themeId,
          primary: this.colors['primary_color'],
          secondary: this.colors['secondary_color'],
          accent: this.colors['accent_color'],
          info: this.colors['info_color'],
          success: this.colors['success_color'],
          error: this.colors['error_color'],
          text1: this.colors['text_color_1'],
          text2: this.colors['text_color_2']
        }
      }).then(() => {
        this.saving = false
        this.$router.back()
      }).catch(() => {
        this.saving = false
      })
    },
    createTheme() {
      this.$apollo.mutate({
        mutation: ADD_THEME_FOR_USER,
        variables: {
          user_id: this.currentUser.id,
          name: this.name,
          primary: this.colors['primary_color'],
          secondary: this.colors['secondary_color'],
          accent: this.colors['accent_color'],
          info: this.colors['info_color'],
          success: this.colors['success_color'],
          error: this.colors['error_color'],
          text1: this.colors['text_color_1'],
          text2: this.colors['text_color_2']
        }
      }).then(() => {
        this.saving = false
        this.$router.back()
      }).catch(() => {
        this.saving = false
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
      variables() {
        return {
          id: this.themeId
        }
      },
      skip() {
        this.loading = false
        return !this.themeId
      },
      result({data}) {
        this.loading = false
        this.name = data.THEME[0].name
        this.colors['primary_color'] = data.THEME[0].primary_color
        this.colors['secondary_color'] = data.THEME[0].secondary_color
        this.colors['accent_color'] = data.THEME[0].accent_color
        this.colors['info_color'] = data.THEME[0].info_color
        this.colors['success_color'] = data.THEME[0].success_color
        this.colors['error_color'] = data.THEME[0].error_color
        this.colors['text_color_1'] = data.THEME[0].text_color_1
        this.colors['text_color_2'] = data.THEME[0].text_color_2
      }
    }
  }
}
</script>

<style scoped>

</style>