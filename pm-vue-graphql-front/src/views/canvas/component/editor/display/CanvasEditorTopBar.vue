<template>
  <v-toolbar color="secondary">
    <v-btn fab small color="accent" class="mr-4" @click="closeEditor">
      <v-icon color="primary">fa-arrow-left</v-icon>
    </v-btn>

    <div class="text-body-1">{{ i18n('canvas.title') }}: {{ projectName }} / {{ pageName }}</div>

    <v-spacer></v-spacer>

    <IconButton
        class="mr-4"
        :label="i18n('common.save')"
        icon="fa-save"
        color="success"
        @click="save">
    </IconButton>

    <IconButton
        v-if="rejectVisible"
        class="mr-4"
        :label="i18n('canvas.rejectChanges')"
        icon="fa-trash-can"
        color="error"
        @click="rejectChanges">
    </IconButton>

    <IconButton
        class="mr-4"
        :label="i18n('canvas.import')"
        icon="fa-file-import"
        color="info"
        @click="importPage">
    </IconButton>

    <IconButton
        :label="i18n('canvas.export')"
        icon="fa-file-export"
        color="info"
        @click="exportPage">
    </IconButton>
  </v-toolbar>
</template>

<script lang="ts">
import Vue from "vue";
import IconButton from "@/components/button/IconButton.vue";

export default Vue.extend({
  name: 'CanvasEditorTopBar',
  components: {IconButton},
  props: {
    projectName: String,
    pageName: String,
    rejectVisible: Boolean
  },
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    },
    closeEditor() {
      this.$emit('closeeditor')
    },
    save(): void {
      this.$emit('save')
    },
    rejectChanges(): void {
      this.$emit('reject')
    },
    importPage(): void {
      console.log('import')
    },
    exportPage(): void {
      console.log('export')
    }
  }
})
</script>

<style scoped>

</style>