<template>
  <div>
    <v-card color="secondary" v-for="page in pagesOrdered" :key="page.id" class="mt-3">
      <v-container fluid class="pl-6 pr-6">
        <v-row no-gutters>
          <v-col class="text-start ma-auto text-body-1">
            {{ page.name }} (ID: {{ page.id }})
          </v-col>

          <v-col class="text-end">
            <span class="text-body-2 text--secondary pr-6">
              {{ i18n('editor.modifyDate') }}: {{ page.modify_date }}
            </span>
            <IconButton
                class="ml-6"
                :label="i18n('common.edit')"
                icon="fa-edit"
                color="info"
                @click="openEditor(page.id)"
            />

            <IconButton
                class="ml-6"
                :label="i18n('common.delete')"
                icon="fa-trash-can"
                color="error"
                @click="deletePageClicked(page.id)"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import IconButton from "@/components/button/IconButton.vue";
import {Page} from "@/lib/types";

export default Vue.extend({
  name: 'AppMenuPagesList',
  components: {IconButton},
  props: {
    projectId: Number,
    datasourceId: Number,
    pages: Array
  },
  computed: {
    pagesOrdered(): Page[] {
      return (this.pages as Page[]).sort((a, b) => Number(a.id) - Number(b.id));
    }
  },
  methods: {
    openEditor(id: number): void {
      this.$router.push({
        name: 'GuiEditor',
        params: {
          projectId: this.projectId.toString(),
          pageId: id.toString(),
          datasourceId: this.datasourceId.toString()
        }
      });
    },
    deletePageClicked(id: number): void {
      this.$emit('delete', id);
    }
  }
})
</script>

<style scoped>

</style>