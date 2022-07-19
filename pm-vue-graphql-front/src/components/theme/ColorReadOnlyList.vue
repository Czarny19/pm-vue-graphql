<template>
  <v-container class="pa-0" fluid>
    <v-row no-gutters>
      <ColorReadOnlyField
          class="pb-6"
          :cols="4"
          :color="theme.primary_color"
          :label="i18n('theme.primary_color')">
      </ColorReadOnlyField>
      <ColorReadOnlyField
          class="pb-6"
          :cols="4"
          :color="theme.secondary_color"
          :label="i18n('theme.secondary_color')">
      </ColorReadOnlyField>
      <ColorReadOnlyField
          class="pb-6"
          :cols="4"
          :color="theme.accent_color"
          :label="i18n('theme.accent_color')">
      </ColorReadOnlyField>
      <ColorReadOnlyField
          class="pb-6"
          :cols="4"
          :color="theme.info_color"
          :label="i18n('theme.info_color')">
      </ColorReadOnlyField>
      <ColorReadOnlyField
          class="pb-6"
          :cols="4"
          :color="theme.success_color"
          :label="i18n('theme.success_color')">
      </ColorReadOnlyField>
      <ColorReadOnlyField
          class="pb-6"
          :cols="4"
          :color="theme.error_color"
          :label="i18n('theme.error_color')">
      </ColorReadOnlyField>
      <ColorReadOnlyField
          class="pb-6"
          :cols="12"
          :color="theme.background_color"
          :label="i18n('theme.background_color')">
      </ColorReadOnlyField>
      <ColorReadOnlyField
          class="pb-6"
          :cols="6"
          :color="theme.text_color_1"
          :label="i18n('theme.text_color_1')">
      </ColorReadOnlyField>
      <ColorReadOnlyField
          class="pb-6"
          :cols="6"
          :color="theme.text_color_2"
          :label="i18n('theme.text_color_2')">
      </ColorReadOnlyField>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import ColorReadOnlyField from "@/components/theme/ColorReadOnlyField.vue";

export default Vue.extend({
  name: 'ColorReadOnlyList',
  components: {ColorReadOnlyField},
  props: {
    theme: Object
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