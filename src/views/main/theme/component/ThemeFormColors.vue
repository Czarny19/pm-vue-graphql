<template>
  <v-container class="pa-0" fluid>
    <v-row no-gutters>
      <ThemeColorField
          :color="colors['primary_color']"
          :label="i18n('theme.primary_color')"
          large
          @updateColor="(color) => colorChanged(color, 'primary_color')">
      </ThemeColorField>

      <ThemeColorField
          :color="colors['secondary_color']"
          :label="i18n('theme.secondary_color')"
          large
          @updateColor="(color) => colorChanged(color, 'secondary_color')">
      </ThemeColorField>

      <ThemeColorField
          :color="colors['accent_color']"
          :label="i18n('theme.accent_color')"
          large
          @updateColor="(color) => colorChanged(color, 'accent_color')">
      </ThemeColorField>

      <ThemeColorField
          :color="colors['info_color']"
          :label="i18n('theme.info_color')"
          large
          @updateColor="(color) => colorChanged(color, 'info_color')">
      </ThemeColorField>

      <ThemeColorField
          :color="colors['success_color']"
          :label="i18n('theme.success_color')"
          large
          @updateColor="(color) => colorChanged(color, 'success_color')">
      </ThemeColorField>

      <ThemeColorField
          :color="colors['error_color']"
          :label="i18n('theme.error_color')"
          large
          @updateColor="(color) => colorChanged(color, 'error_color')">
      </ThemeColorField>

      <ThemeColorField
          :color="colors['background_color']"
          :label="i18n('theme.background_color')"
          xlarge
          @updateColor="(color) => colorChanged(color, 'background_color')">
      </ThemeColorField>

      <ThemeColorField
          :color="colors['text_color_1']"
          :label="i18n('theme.text_color_1')"
          large
          @updateColor="(color) => colorChanged(color, 'text_color_1')">
      </ThemeColorField>

      <ThemeColorField
          :color="colors['text_color_2']"
          :label="i18n('theme.text_color_2')"
          large
          @updateColor="(color) => colorChanged(color, 'text_color_2')">
      </ThemeColorField>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import ThemeColorField from "@/views/main/theme/component/ThemeColorField.vue";

export default Vue.extend({
  name: 'ThemeFormColors',
  components: {ThemeColorField},
  props: {
    colors: {}
  },
  methods: {
    colorChanged(color: string, id: string): void {
      this.$emit('colorchanged', {color: color, id: id})
    }
  }
})
</script>

<style scoped>

</style>