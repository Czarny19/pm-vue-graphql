<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="300">
      <v-card>
        <v-card-text class="pt-6">
          <v-progress-circular indeterminate color="primary" size="50"/>
          <div class="dialog--title">{{ title }}</div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'LoadingDialog',
  props: {
    title: String,
    dialog: Boolean
  }
}
</script>

<style scoped>

</style>