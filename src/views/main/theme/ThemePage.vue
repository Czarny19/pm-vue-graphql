<template>
  <v-container fluid>
    <TitleCard class="ma-1 mb-2" :title="i18n('theme.interfaceTheme')" icon="fa-palette"/>
    <ThemeForm :loading="loading" :theme="theme" :user-id="currentUser.id"/>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import ThemeForm from "@/views/main/theme/component/ThemeForm.vue";
import TitleCard from "@/components/card/TitleCard.vue";
import {CURRENT_USER} from "@/graphql/queries/user";
import {GET_THEME_BY_ID} from "@/graphql/queries/theme";

export default Vue.extend({
  name: 'ThemePage',
  components: {TitleCard, ThemeForm},
  data() {
    return {
      loading: true,
      currentUser: {id: -1},
      theme: {}
    }
  },
  computed: {
    themeId(): number {
      return Number(this.$route.params.themeId);
    }
  },
  apollo: {
    currentUser: {
      query: CURRENT_USER
    },
    THEME: {
      query: GET_THEME_BY_ID,
      fetchPolicy: 'network-only',
      variables(): { id: number } {
        return {
          id: this.themeId
        }
      },
      skip(): boolean {
        return !this.themeId;
      },
      result({data}): void {
        this.loading = false;
        this.theme = data.THEME[0];
      }
    }
  },
  beforeMount() {
    if (!this.themeId) {
      this.loading = false;
    }
  }
})
</script>

<style scoped>

</style>