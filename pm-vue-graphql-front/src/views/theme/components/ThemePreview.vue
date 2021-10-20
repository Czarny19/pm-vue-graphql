<template>
  <v-card class="theme__preview--container elevation-16 mx-auto">
    <nav class="v-toolbar elevation-0 transparent mt-0 pr-0 pl-0" data-booted="true">
      <v-toolbar :color="primary">
        <v-btn plain class="mr-2">
          <v-icon size="20">fa-arrow-left</v-icon>
        </v-btn>
        {{ $t('theme.example') }}
        <v-spacer/>
        <v-btn plain>
          <v-icon size="20">fa-bars</v-icon>
        </v-btn>
      </v-toolbar>
    </nav>

    <div
        class="theme__preview--text pa-4 text-left body-1"
        v-html="$t('theme.primaryExampleText')"
        :style="{'color': text1}">
    </div>

    <div
        class="theme__preview--text pa-4 text-left body-2"
        v-html="$t('theme.secondaryExampleText')"
        :style="{'color': text2}">
    </div>

    <div class="theme__preview--message ma-4 pa-2 text-left white--text" :style="{'background-color': info}">
      <v-icon class="pr-4">fa-info-circle</v-icon>
      {{ $t('theme.infoText') }}
    </div>

    <div class="theme__preview--message ma-4 pa-2 text-left" :style="{'background-color': success}">
      <v-icon class="pr-4">fa-check-circle</v-icon>
      {{ $t('theme.success') }}
    </div>

    <div class="theme__preview--message ma-4 pa-2 text-left" :style="{'background-color': error}">
      <v-icon class="pr-4">fa-times-circle</v-icon>
      {{ $t('theme.error') }}
    </div>

    <v-btn class="theme__preview--add" fab bottom absolute right :color="secondary">
      <v-icon small>fa-plus</v-icon>
    </v-btn>

    <v-footer class="theme__preview--footer" absolute :color="accent">
      <div class="text-center">{{ $t('theme.accent') }}</div>
    </v-footer>
  </v-card>
</template>

<script>
export default {
  name: 'ThemePreview',
  props: {
    colors: Object
  },
  computed: {
    primary() {
      return this.colors['primary_color']
    },
    secondary() {
      return this.colors['secondary_color']
    },
    accent() {
      return this.colors['accent_color']
    },
    info() {
      return this.colors['info_color']
    },
    success() {
      return this.colors['success_color']
    },
    error() {
      return this.colors['error_color']
    },
    text1() {
      return this.colors['text_color_1']
    },
    text2() {
      return this.colors['text_color_2']
    }
  }
}
</script>

<style scoped>

</style>