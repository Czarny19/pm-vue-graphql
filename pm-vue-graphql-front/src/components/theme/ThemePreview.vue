<template>
  <v-card class="theme__preview--container" :color="colors['background_color']">

    <nav class="v-toolbar elevation-0 transparent mt-0 pr-0 pl-0" data-booted="true">
      <v-toolbar :color="colors['primary_color']">
        <v-btn plain class="mr-2">
          <v-icon size="20">fa-arrow-left</v-icon>
        </v-btn>
        {{ i18n('theme.exampleTitle') }}
        <v-spacer/>
        <v-btn plain>
          <v-icon size="20">fa-bars</v-icon>
        </v-btn>
      </v-toolbar>
    </nav>

    <div
        class="theme__preview--text text-start body-1"
        v-html="i18n('theme.primaryExampleText')"
        :style="{'color': colors['text_color_1']}">
    </div>

    <div
        class="theme__preview--text text-start body-2 mb-10"
        v-html="i18n('theme.secondaryExampleText')"
        :style="{'color': colors['text_color_2']}">
    </div>

    <div class="theme__preview--message text-start white--text"
         :style="{'background-color': colors['info_color']}">
      <v-icon class="pr-4">fa-info-circle</v-icon>
      {{ i18n('theme.infoText') }}
    </div>

    <div class="theme__preview--message text-start" :style="{'background-color': colors['success_color']}">
      <v-icon class="pr-4">fa-check-circle</v-icon>
      {{ i18n('theme.success') }}
    </div>

    <div class="theme__preview--message text-start" :style="{'background-color': colors['error_color']}">
      <v-icon class="pr-4">fa-times-circle</v-icon>
      {{ i18n('theme.error') }}
    </div>

    <v-btn class="theme__preview--add" fab bottom absolute right :color="colors['secondary_color']">
      <v-icon small>fa-plus</v-icon>
    </v-btn>

    <v-footer absolute :color="colors['accent_color']">
      <div class="text-center">{{ i18n('theme.accent') }}</div>
    </v-footer>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'ThemePreview',
  props: {
    colors: Object
  },
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    }
  }
})
</script>

<style scoped>

</style>