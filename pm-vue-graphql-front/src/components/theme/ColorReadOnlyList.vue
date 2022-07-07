<template>
  <v-container class="pa-0" fluid>
    <v-row no-gutters>
      <ColorReadOnlyField
          class="pb-6"
          :cols="4"
          :color="theme.primary_color"
          :label="i18n('theme.primary')">
      </ColorReadOnlyField>
      <ColorReadOnlyField
          class="pb-6"
          :cols="4"
          :color="theme.secondary_color"
          :label="i18n('theme.secondary')">
      </ColorReadOnlyField>
      <ColorReadOnlyField
          class="pb-6"
          :cols="4"
          :color="theme.accent_color"
          :label="i18n('theme.accent')">
      </ColorReadOnlyField>
      <ColorReadOnlyField
          class="pb-6"
          :cols="4"
          :color="theme.info_color"
          :label="i18n('theme.info')">
      </ColorReadOnlyField>
      <ColorReadOnlyField
          class="pb-6"
          :cols="4"
          :color="theme.success_color"
          :label="i18n('theme.success')">
      </ColorReadOnlyField>
      <ColorReadOnlyField
          class="pb-6"
          :cols="4"
          :color="theme.error_color"
          :label="i18n('theme.error')">
      </ColorReadOnlyField>
      <ColorReadOnlyField
          class="pb-6"
          :cols="12"
          :color="theme.background_color"
          :label="i18n('theme.background')">
      </ColorReadOnlyField>
      <ColorReadOnlyField
          class="pb-6"
          :cols="6"
          :color="theme.text_color_1"
          :label="i18n('theme.primaryText')">
      </ColorReadOnlyField>
      <ColorReadOnlyField
          class="pb-6"
          :cols="6"
          :color="theme.text_color_2"
          :label="i18n('theme.secondaryText')">
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