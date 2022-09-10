<template>
  <v-card-title class="secondary ml-3 mr-3 mt-1 pt-2 pb-2 elevation-2 rounded">
    {{ title }}

    <v-btn v-if="showHideButton && isHidden" class="ml-auto" width="100" @click="showHideClicked">
      {{ i18n('common.show') }}
    </v-btn>

    <v-btn v-if="showHideButton && !isHidden" class="ml-auto" width="100" @click="showHideClicked">
      {{ i18n('common.hide') }}
    </v-btn>
  </v-card-title>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: 'CardSectionTitle',
  props: {
    title: String,
    showHideButton: Boolean,
    isHidden: Boolean
  },
  methods: {
    showHideClicked(): void {
      this.$emit('showhideclick');
    }
  }
})
</script>

<style scoped>

</style>