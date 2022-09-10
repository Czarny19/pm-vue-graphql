<template>
  <v-expansion-panels>
    <v-expansion-panel v-for="(theme, index) in themes" :key="theme.id">
      <v-expansion-panel-header class="text-start" expand-icon="fa-angle-down" color="secondary">
        {{ theme.name }}
      </v-expansion-panel-header>

      <v-expansion-panel-content class="pb-4">
        <ColorReadOnlyList class="pt-6 pl-2 pr-2" :theme="colors(index)"/>
        <v-divider class="ml-4 mr-4"></v-divider>

        <v-container fluid class="pl-4 pr-4 pt-4 pb-0">
          <v-row no-gutters>
            <v-col cols="6" class="text-start">
              <IconButton
                  class="mr-6"
                  :label="i18n('common.modify')"
                  color="info"
                  icon="fa-edit"
                  @click="openModifyTheme(theme.id)"
              />
              <ThemePreviewTooltip :colors="colors(index)"/>
            </v-col>

            <v-col class="text-end">
              <IconButton
                  :label="i18n('common.delete')"
                  color="error"
                  icon="fa-trash-can"
                  @click="deleteThemeClicked(theme.id)"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import Vue from "vue";
import ColorReadOnlyList from "@/components/theme/ColorReadOnlyList.vue";
import ThemePreviewTooltip from "@/components/theme/ThemePreviewTooltip.vue";
import IconButton from "@/components/button/IconButton.vue";
import {ThemeColors} from "@/lib/types";

export default Vue.extend({
  name: 'DashboardThemesList',
  components: {IconButton, ThemePreviewTooltip, ColorReadOnlyList},
  props: {
    themes: Array
  },
  methods: {
    colors(index: number): ThemeColors {
      return this.themes[index] as ThemeColors;
    },
    openModifyTheme(id: string): void {
      this.$router.push({name: 'Theme', params: {themeId: id}});
    },
    deleteThemeClicked(id: number): void {
      this.$emit('delete', id);
    }
  }
})
</script>

<style scoped>

</style>