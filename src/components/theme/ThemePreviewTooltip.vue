<template>
  <v-tooltip top color="primary" class="pa-4" min-width="600">
    <template v-slot:activator="{ on, attrs }">
      <v-btn small class="pa-4" min-width="100" color="success" v-bind="attrs" v-on="on">
        {{ i18n('common.preview') }}
        <v-icon small class="pl-6">fa-message</v-icon>
      </v-btn>
    </template>

    <ThemePreview :colors="colors"/>
  </v-tooltip>
</template>

<script lang="ts">
import Vue from "vue";
import ThemePreview from "@/components/theme/ThemePreview.vue";

export default Vue.extend({
  name: 'ThemePreviewTooltip',
  components: {ThemePreview},
  props: {
    colors: Object
  }
})
</script>

<style scoped>

</style>