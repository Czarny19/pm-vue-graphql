<template>
  <v-toolbar color="secondary">
    <v-btn fab small color="accent" class="mr-4" @click="closeEditor">
      <v-icon color="primary">fa-arrow-left</v-icon>
    </v-btn>

    <div class="text-body-1">
      {{ i18n('editor.titleQuery') }}: {{ query.name }}
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
  name: 'QueryTopBar',
  components: {IconButton},
  props: {
    query: Object,
    rejectVisible: Boolean
  },
  methods: {
    i18n(key: string): string {
      return this.$t(key).toString()
    },
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