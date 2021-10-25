<template>
  <div>
    <v-dialog v-model="dialog" width="400">
      <v-card>
        <v-card-title class="text-left">
          {{ $t('delete.title') }}
        </v-card-title>
        <v-card-text class="text-left">
          {{ $t('delete.msg') }}
        </v-card-text>
        <v-card-actions class="mt-4">
          <v-btn text color="error" @click="confirmed">{{ $t('common.delete') }}</v-btn>
          <v-btn text @click="cancelled">{{ $t('common.cancel') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'DeleteConfirmationDialog',
  props: {
    dialog: Boolean
  },
  methods: {
    confirmed() {
      this.$emit('confirmed')
    },
    cancelled() {
      this.$emit('cancelled')
    }
  }
}
</script>

<style scoped>

</style>