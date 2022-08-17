<template>
  <v-toolbar color="secondary" height="60">
    <input id="fileUpload" type="file" hidden @change="setImportedPage">

    <v-btn fab x-small color="accent" class="mr-4" @click="closeEditor">
      <v-icon small color="primary">fa-arrow-left</v-icon>
    </v-btn>

    <div class="text-body-2">
      {{ i18n('editor.title') }}: {{ projectName }} / {{ i18n('editor.page') }} / {{ pageName }}
    </div>

    <v-spacer></v-spacer>

    <IconButton
        v-if="previewOpen"
        class="mr-4"
        :label="i18n('editor.closePreview')"
        icon="fa-eye"
        color="error"
        @click="switchPreview">
    </IconButton>

    <IconButton
        v-else
        class="mr-4"
        :label="i18n('editor.preview')"
        icon="fa-eye"
        color="primary"
        @click="switchPreview">
    </IconButton>

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
        :label="i18n('editor.rejectChanges')"
        icon="fa-trash-can"
        color="error"
        @click="rejectChanges">
    </IconButton>

    <IconButton
        class="mr-4"
        :label="i18n('editor.import')"
        icon="fa-file-import"
        color="info"
        @click="importPage">
    </IconButton>

    <IconButton
        :label="i18n('editor.export')"
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
  name: 'GuiEditorTopBar',
  components: {IconButton},
  props: {
    projectName: String,
    pageName: String,
    pageDefinition: Object,
    rejectVisible: Boolean,
    previewOpen: Boolean
  },
  methods: {
    closeEditor(): void {
      this.$emit('closeeditor')
    },
    switchPreview(): void {
      this.$emit('swichpreview')
    },
    save(): void {
      this.$emit('save')
    },
    rejectChanges(): void {
      this.$emit('reject')
    },
    importPage(): void {
      document.getElementById('fileUpload')?.click()
    },
    async setImportedPage(): Promise<void> {
      const input = document.getElementById('fileUpload') as HTMLInputElement
      const fileList = input?.files
      const file: File | null | undefined = fileList?.item(0)

      if (file != null) {
        this.$emit('import', JSON.parse(await file.text()))
      }
    },
    exportPage(): void {
      const filename = this.pageName + '.json';
      const jsonStr = JSON.stringify(this.pageDefinition);

      let element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr));
      element.setAttribute('download', filename);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    }
  }
})
</script>

<style scoped>

</style>