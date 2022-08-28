<template>
  <div>
    <v-select
        color="accent"
        outlined dense hide-details
        :label="i18n('editor.actionTarget')"
        :items="pages"
        v-model="currentProp.target"
        item-value="id"
        item-text="name"
        item-color="accent">
    </v-select>

    <div class="text-start text-body-2 pt-4 pl-1">
      {{ i18n('editor.variables') }}
    </div>

    <div v-for="(variable, index) in currentProp.variables" :key="index">
      <v-select
          class="pt-3"
          color="accent"
          outlined dense hide-details
          :label="`${variable.name} (${variable.type})`"
          :items="variables"
          v-model="variable.pageVar"
          item-value="id"
          item-text="name"
          item-color="accent">
      </v-select>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {ActionProp, Page} from "@/lib/types";

export default Vue.extend({
  name: 'GuiEditorActionGoToPage',
  props: {
    prop: Object,
    pages: Array,
    variables: Array
  },
  data() {
    return {
      currentProp: {},
      currentPageId: -1
    }
  },
  computed: {
    selectedPage(): Page | undefined {
      const pages = (this.pages as Page[])?.filter((page) => page.id === this.prop.target)

      if (pages.length) {
        return pages[0]
      }

      return undefined
    }
  },
  watch: {
    currentProp: {
      handler() {
        if ((this.currentProp as ActionProp).target !== this.currentPageId) {
          this.currentPageId = (this.currentProp as ActionProp).target

          if (this.selectedPage) {
            const pageParams = this.selectedPage.params.split(';')

            pageParams.forEach((param) => {
              (this.currentProp as ActionProp).variables.push({
                name: param,
                type: 'String',
                value: '',
                pageVar: -1
              })
            })
          }
        }
      },
      deep: true
    }
  },
  async beforeMount() {
    this.currentProp = this.prop
    this.currentPageId = (this.currentProp as ActionProp).target
  }
})
</script>

<style scoped>

</style>