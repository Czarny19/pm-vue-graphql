<template>
  <v-toolbar>
    <div class="text-body-2">{{ $t('canvas.title') }}: {{ project.name }}</div>
    <v-spacer></v-spacer>
    <v-btn class="mr-4" color="primary" @click="closeCanvas">
      {{ $t('common.back') }}
      <v-icon class="toolbar-button-icon" size="16">fa-arrow-left</v-icon>
    </v-btn>
    <v-btn class="mr-1" color="success" @click="save">
      {{ $t('common.save') }}
      <v-icon class="toolbar-button-icon" size="16">fa-save</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
export default {
  name: 'CanvasTopBar',
  props: {
    project: Object
  },
  methods: {
    closeCanvas() {
      this.$router.back()
    },
    save() {

    }
  }
}
</script>

<style scoped>

</style>