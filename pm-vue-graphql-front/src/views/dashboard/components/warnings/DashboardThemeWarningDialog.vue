<template>
  <div>
    <v-dialog v-model="dialog" width="400">
      <template v-slot:activator="{ on, attrs }">
        <div v-bind="attrs" v-on="on">
          <slot name="activator"/>
        </div>
      </template>
      <v-card>
        <v-card-title class="text-left">
          {{ $t('dashboard.themeDeleteWarning') }}
        </v-card-title>
        <v-card-text class="text-left" v-html="$t('dashboard.themeProjectExists')"/>
        <v-card-actions class="mt-4">
          <v-btn text @click="close">{{ $t('common.ok') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'DashboardThemeWarningDialog',
  props: {
    dialog: Boolean
  },
  methods: {
    close() {
      this.$emit('closed')
    }
  }
}
</script>

<style scoped>

</style>