<template>
  <v-toolbar>
    <div class="text-body-2">{{ $t('canvas.title') }}: {{ app.name }}</div>
    <v-spacer></v-spacer>
    <v-btn color="success" @click="save">{{ $t('common.save') }}</v-btn>
  </v-toolbar>
</template>

<script>
export default {
  name: 'CanvasTopBar',
  props: {
    app: Object
  },
  methods: {
    save() {

    }
  }
}
</script>

<style scoped>

</style>