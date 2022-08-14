<template>
  <v-toolbar dense height="60" color="secondary">
    <v-btn fab x-small color="accent" class="mr-4" @click="closeEditor">
      <v-icon small color="primary">fa-arrow-left</v-icon>
    </v-btn>

    <div class="text-body-2">
      {{ i18n('editor.titleMutation') }}: {{ mutation.name }}
    </div>

    <v-spacer></v-spacer>

    <IconButton
        v-if="rejectVisible"
        class="mr-4"
        :label="i18n('editor.rejectChanges')"
        icon="fa-trash-can"
        color="error"
        @click="rejectChanges">
    </IconButton>

    <IconButton
        :label="i18n('common.save')"
        icon="fa-save"
        color="success"
        @click="save">
    </IconButton>
  </v-toolbar>
</template>

<script lang="ts">
import Vue from "vue";
import IconButton from "@/components/button/IconButton.vue";

export default Vue.extend({
  name: 'MutationTopBar',
  components: {IconButton},
  props: {
    mutation: Object,
    rejectVisible: Boolean
  },
  methods: {
    closeEditor(): void {
      this.$emit('closeeditor')
    },
    save(): void {
      this.$emit('save')
    },
    rejectChanges(): void {
      this.$emit('reject')
    }
  }
})
</script>

<style scoped>

</style>