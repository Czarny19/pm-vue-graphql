<template>
  <v-dialog v-model="dialog" width="360">
    <template v-slot:activator="{ on, attrs }">
      <v-col v-if="large" cols="12" sm="12" md="12" lg="6" xl="6">
        <div class="text-left pb-2">{{ label }}</div>

        <v-btn :color="color" width="100%" v-bind="attrs" v-on="on">
          {{ color }}
        </v-btn>
      </v-col>

      <v-col v-else cols="6" sm="6" md="6" lg="4" xl="4">
        <div class="text-left pb-2">{{ label }}</div>

        <v-btn :color="color" width="100%" v-bind="attrs" v-on="on">
          {{ color }}
        </v-btn>
      </v-col>
    </template>

    <v-card class="text-center">
      <v-card-title class="mb-4">
        {{ $t('theme.pickColor') }}
      </v-card-title>

      <v-card-text>
        <v-color-picker v-model="pickerColor" hide-inputs></v-color-picker>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="success" text @click="dialog = false">{{ $t('common.ok') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ThemeColorField',
  props: {
    color: String,
    label: String,
    large: Boolean
  },
  data() {
    return {
      dialog: false,
      pickerColor: ''
    }
  },
  watch: {
    pickerColor() {
      this.$emit('updateColor', this.pickerColor)
    }
  },
  beforeMount() {
    this.pickerColor = this.color
  }
}
</script>

<style scoped>

</style>