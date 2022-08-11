<template>
  <v-container class="pa-0" fluid>
    <v-row no-gutters>
      <ColorReadOnlyColumn :cols="4" :color="colors.primary_color" :label="i18n('theme.primary_color')"/>
      <ColorReadOnlyColumn :cols="4" :color="colors.secondary_color" :label="i18n('theme.secondary_color')"/>
      <ColorReadOnlyColumn :cols="4" :color="colors.accent_color" :label="i18n('theme.accent_color')"/>
      <ColorReadOnlyColumn :cols="4" :color="colors.info_color" :label="i18n('theme.info_color')"/>
      <ColorReadOnlyColumn :cols="4" :color="colors.success_color" :label="i18n('theme.success_color')"/>
      <ColorReadOnlyColumn :cols="4" :color="colors.error_color" :label="i18n('theme.error_color')"/>
      <ColorReadOnlyColumn :cols="12" :color="colors.background_color" :label="i18n('theme.background_color')"/>
      <ColorReadOnlyColumn :cols="6" :color="colors.text_color_1" :label="i18n('theme.text_color_1')"/>
      <ColorReadOnlyColumn :cols="6" :color="colors.text_color_2" :label="i18n('theme.text_color_2')"/>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import ColorReadOnlyColumn from "@/components/theme/ColorReadOnlyColumn.vue";
import {ThemeColors} from "@/lib/types";

export default Vue.extend({
  name: 'ColorReadOnlyList',
  components: {ColorReadOnlyColumn},
  props: {
    theme: Object
  },
  computed: {
    colors(): ThemeColors {
      return this.theme as ThemeColors;
    }
  }
})
</script>

<style scoped>

</style>