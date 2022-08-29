<template>
  <v-card color="primary">
    <v-card-title>{{ i18n('editor.topNavigation') }}</v-card-title>

    <v-card-text>
      <v-form v-model="topNavValid" ref="form" @submit.prevent="updateNav">
        <v-switch
            color="info"
            v-model="currentProject.top_nav"
            :label="i18n('editor.topNavigationEnabled')"
            @change="changed=true">
        </v-switch>

        <template v-for="(item, index) in currentProject.top_nav_items.items">
          <v-container :key="index" class="pa-0">
            <v-row no-gutters class="pb-2">
              <v-col cols="5" class="pr-3">
                <v-text-field
                    class="pa-0"
                    color="accent"
                    v-model="item.name"
                    :label="i18n('editor.navItemName')"
                    :counter="30"
                    :rules="nameRules"
                    required
                    @change="changed=true">
                </v-text-field>
              </v-col>

              <v-col cols="6" class="pl-3 pr-3">
                <v-select
                    class="pa-0"
                    color="accent"
                    item-color="accent"
                    v-model="item.page"
                    :items="pages"
                    :label="i18n('editor.navItemPage')"
                    item-value="id"
                    item-text="name"
                    required
                    append-icon="fa-chevron-down"
                    @change="changed=true">
                </v-select>
              </v-col>

              <v-col cols="1" class="pl-3 text-end">
                <v-btn fab x-small color="error" @click="deleteNavItem(index)">
                  <v-icon small>fa-times</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </template>

        <div class="text-start">
          <IconButton
              class="mt-2"
              :label="i18n('editor.topNavigationAdd')"
              icon="fa-plus"
              color="info"
              @click="addNavItem">
          </IconButton>
        </div>
      </v-form>
    </v-card-text>

    <v-card-actions v-if="changed" class="pa-4 text-end">
      <IconButton :label="i18n('common.save')" color="success" icon="fa-save" @click="submit"/>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import IconButton from "@/components/button/IconButton.vue";
import {UPDATE_PROJECT_TOP_NAV} from "@/graphql/queries/project";
import {AppProject} from "@/lib/types";

export default Vue.extend({
  name: 'AppMenuSettingNav',
  components: {IconButton},
  props: {
    project: Object,
    pages: Array
  },
  data() {
    return {
      currentProject: {},
      navItems: {},
      changed: false,
      topNavValid: false,
      nameRules: [
        (v: string) => !!v || this.$t('editor.navItemNameRequired'),
        (v: string) => (v && v.length <= 30) || this.$t('editor.navItemNameTooLong'),
      ],
      pageRules: [
        (v: string) => !!v || this.$t('editor.navItemPageRequired')
      ]
    }
  },
  methods: {
    submit(): void {
      (this.$refs.form as Vue & { validate: () => boolean }).validate()
      if (this.topNavValid) this.updateNav()
    },
    addNavItem(): void {
      (this.currentProject as AppProject).top_nav_items.items.push({name: '', page: -1})
      this.changed = true
    },
    updateNav(): void {
      this.$apollo.mutate({
        mutation: UPDATE_PROJECT_TOP_NAV,
        variables: {
          id: this.project.id,
          topNav: this.project.top_nav,
          topNavItems: this.project.top_nav_items
        }
      }).then(async () => {
        this.changed = false
      }).catch(() => {
        this.changed = false
      })
    },
    deleteNavItem(index: number): void {
      (this.currentProject as AppProject).top_nav_items.items.splice(index, 1)
      this.changed = true
    }
  },
  beforeMount() {
    this.currentProject = this.project

    if (!this.project.top_nav_items) {
      (this.currentProject as AppProject).top_nav_items = {"items": []}
    }

    this.navItems = (this.currentProject as AppProject).top_nav_items.items
  }
})
</script>

<style scoped>

</style>