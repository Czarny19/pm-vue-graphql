<template>
  <div>
    <div class="text-body-1 pl-3 pr-3 pt-1 pb-1 mt-2 mb-3 editor--action-tab">
      {{ i18n('editor.actionYesNoDialogContent') }}
    </div>

    <v-select
        class="pt-3"
        color="accent"
        outlined dense hide-details
        :label="i18n('editor.actionYesNoTitle')"
        :items="['', ...variables]"
        v-model="currentProp.dialogTitleVar"
        item-value="id"
        item-text="name"
        item-color="accent"
    />

    <v-select
        class="pt-3"
        color="accent"
        outlined dense hide-details
        :label="i18n('editor.actionYesNoMsg')"
        :items="['', ...variables]"
        v-model="currentProp.dialogMsgVar"
        item-value="id"
        item-text="name"
        item-color="accent"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'GuiEditorActionYesNoDialog',
  props: {
    prop: Object,
    variables: Array
  },
  data() {
    return {
      currentProp: {},
      currentPageId: -1
    }
  },
  async beforeMount() {
    this.currentProp = this.prop;
  }
})
</script>

<style scoped>

</style>