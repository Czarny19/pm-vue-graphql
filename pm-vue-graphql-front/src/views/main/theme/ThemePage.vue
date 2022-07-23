<template>
  <v-container fluid>
    <LoadingDialog :dialog="saving" :title="i18n('theme.saving')"/>

    <v-row class="mt-2 ml-2 mr-2">
      <v-col>
        <TitleCard :title="i18n('theme.interfaceTheme')" icon="fa-palette"/>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col>
        <ThemeForm :theme-id="themeId" @saving="setSaving"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import LoadingDialog from "@/components/dialog/LoadingDialog.vue";
import ThemeForm from "@/views/main/theme/component/ThemeForm.vue";
import TitleCard from "@/components/card/TitleCard.vue";

export default Vue.extend({
  name: 'ThemePage',
  components: {TitleCard, ThemeForm, LoadingDialog},
  data() {
    return {
      saving: false,
    }
  },
  computed: {
    themeId(): number {
      return Number(this.$route.params.themeId)
    }
  },
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    },
    setSaving(saving: boolean): void {
      this.saving = saving
    }
  }
})
</script>

<style scoped>

</style>